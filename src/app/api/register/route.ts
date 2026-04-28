import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, surname, dni, email, phone, ticket, branch } = body;

    if (!name || !surname || !dni || !email || !phone || !ticket || !branch) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const existing = await prisma.participant.findUnique({
      where: {
        ticket_branch: {
          ticket,
          branch,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Este ticket ya fue registrado en esta sucursal.' },
        { status: 400 }
      );
    }

    const participant = await prisma.participant.create({
      data: { name, surname, dni, email, phone, ticket, branch },
    });

    const chances = await prisma.participant.count({
      where: { dni },
    });

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
  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
