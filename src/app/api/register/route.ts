import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, surname, dni, email, phone, ticket, branch, amount } = body;

    if (!name || !surname || !dni || !email || !phone || !ticket || !branch) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    // Migración automática (por si acaso no se corrió localmente)
    try {
      await sql`ALTER TABLE "Participant" ADD COLUMN IF NOT EXISTS "amount" TEXT`;
    } catch (e) {
      console.log('Columna amount ya existe o error silencioso');
    }

    // Verificar si ya existe el ticket en esa sucursal
    const existing = await sql`
      SELECT id FROM "Participant" 
      WHERE ticket = ${ticket} AND branch = ${branch} 
      LIMIT 1
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Este ticket ya fue registrado en esta sucursal.' },
        { status: 400 }
      );
    }

    // Insertar el nuevo participante
    const [participant] = await sql`
      INSERT INTO "Participant" (name, surname, dni, email, phone, ticket, branch, amount, "createdAt")
      VALUES (${name}, ${surname}, ${dni}, ${email}, ${phone}, ${ticket}, ${branch}, ${amount || ''}, NOW())
      RETURNING *
    `;

    // Contar chances (DNI)
    const resultCount = await sql`
      SELECT count(*) FROM "Participant" WHERE dni = ${dni}
    `;
    const chances = resultCount[0].count;

    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Sorteo PFM <onboarding@resend.dev>',
          to: email,
          subject: 'Registro exitoso para el sorteo!',
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>Hola ${name} ${surname}!</h2>
              <p>Tu registro con el ticket <strong>${ticket}</strong> de la sucursal <strong>${branch}</strong> ha sido confirmado.</p>
              <p>Hasta el momento, tienes <strong>${chances} chance(s)</strong> de ganar en el sorteo (basado en tu DNI: ${dni}).</p>
              <p>¡Mucha suerte!</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Error enviando email:', emailError);
      }
    }

    return NextResponse.json({ success: true, participant, chances });
  } catch (error: any) {
    console.error('Error en el registro:', error);
    return NextResponse.json({ error: 'Error de conexión a la base de datos', details: error.message }, { status: 500 });
  }
}
