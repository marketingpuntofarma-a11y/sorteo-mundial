import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const allParticipants = await sql`SELECT * FROM "Participant"`;

    if (allParticipants.length === 0) {
      return NextResponse.json({ error: 'No hay participantes registrados.' }, { status: 400 });
    }

    const chancesMap = new Map<string, any>();
    const loteria: string[] = [];

    for (const p of allParticipants) {
      if (!chancesMap.has(p.dni)) {
        chancesMap.set(p.dni, p);
      }
      loteria.push(p.dni);
    }

    const randomIndex = Math.floor(Math.random() * loteria.length);
    const winningDNI = loteria[randomIndex];

    const winnerData = chancesMap.get(winningDNI);
    const totalChances = loteria.filter(d => d === winningDNI).length;

    return NextResponse.json({
      winner: winnerData,
      totalChances,
      totalTickets: loteria.length,
      totalUniqueParticipants: chancesMap.size
    });

  } catch (error) {
    console.error('Error en el sorteo:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
