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
      // Cálculo de chances del ticket actual
      const cleanAmount = parseFloat(p.amount?.replace(/\./g, '').replace(',', '.') || '0');
      const ticketChances = Math.floor(cleanAmount / 50000);

      if (ticketChances > 0) {
        if (!chancesMap.has(p.dni)) {
          chancesMap.set(p.dni, { ...p, totalChances: 0 });
        }
        
        // Sumar chances al DNI
        chancesMap.get(p.dni).totalChances += ticketChances;
        
        // Agregar al bolillero tantas veces como chances tenga este ticket
        for (let i = 0; i < ticketChances; i++) {
          loteria.push(p.dni);
        }
      }
    }

    if (loteria.length === 0) {
      return NextResponse.json({ error: 'No hay participantes con al menos 1 chance (mínimo $50.000).' }, { status: 400 });
    }

    const randomIndex = Math.floor(Math.random() * loteria.length);
    const winningDNI = loteria[randomIndex];

    const winnerData = chancesMap.get(winningDNI);

    return NextResponse.json({
      winner: winnerData,
      totalChances: winnerData.totalChances,
      totalTicketsInPool: loteria.length,
      totalUniqueParticipants: chancesMap.size
    });


  } catch (error) {
    console.error('Error en el sorteo:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
