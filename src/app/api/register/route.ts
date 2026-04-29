import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

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

    // Limpiar el importe para el cálculo (quitar puntos, cambiar coma por punto)
    const cleanAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    const currentTicketChances = Math.floor(cleanAmount / 50000);

    // Insertar el nuevo participante
    const [participant] = await sql`
      INSERT INTO "Participant" (name, surname, dni, email, phone, ticket, branch, amount, "createdAt")
      VALUES (${name}, ${surname}, ${dni}, ${email}, ${phone}, ${ticket}, ${branch}, ${amount}, NOW())
      RETURNING *
    `;

    // Calcular chances totales (suma de chances de todos sus tickets)
    const allUserTickets = await sql`
      SELECT amount FROM "Participant" WHERE dni = ${dni}
    `;
    
    let totalChances = 0;
    allUserTickets.forEach(t => {
      const amt = parseFloat(t.amount.replace(/\./g, '').replace(',', '.'));
      totalChances += Math.floor(amt / 50000);
    });

    const chances = totalChances;

    // Enviar Email vía SMTP si están las credenciales
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await transporter.sendMail({
          from: `"Sorteo Mundial PFM" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          to: email,
          subject: '¡Registro Exitoso - Sorteo Mundial PFM!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b; line-height: 1.6;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; margin-bottom: 10px;">¡Hola ${name}!</h1>
                <p style="font-size: 18px; font-weight: bold;">Tu ticket ha sido registrado correctamente.</p>
              </div>
              
              <div style="background-color: #f8fafc; border-radius: 16px; padding: 25px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
                <h2 style="font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0;">Detalles del Registro</h2>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 10px;"><strong>N° de Ticket:</strong> ${ticket}</li>
                  <li style="margin-bottom: 10px;"><strong>Sucursal:</strong> ${branch}</li>
                  <li style="margin-bottom: 10px;"><strong>Importe:</strong> $ ${amount}</li>
                </ul>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px dashed #cbd5e1; text-align: center;">
                  <p style="font-size: 12px; color: #64748b; margin-bottom: 5px;">TUS CHANCES ACUMULADAS</p>
                  <span style="font-size: 48px; font-weight: 900; color: #2563eb;">${chances}</span>
                </div>
              </div>
              
              <div style="text-align: center; font-size: 12px; color: #94a3b8;">
                <p>Recuerde conservar el ticket físico original. El mismo está sujeto a revisión.</p>
                <p style="margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 20px;">© 2026 PuntoFarma - Sorteo Mundial</p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Error enviando email SMTP:', emailError);
      }
    }

    return NextResponse.json({ success: true, participant, chances });
  } catch (error: any) {
    console.error('Error en el registro:', error);
    return NextResponse.json({ error: 'Error de conexión a la base de datos', details: error.message }, { status: 500 });
  }
}
