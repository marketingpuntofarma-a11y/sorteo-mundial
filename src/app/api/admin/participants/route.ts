import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  return token === process.env.ADMIN_SECRET;
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    console.log('Intentando obtener participantes...');
    const participants = await sql`
      SELECT * FROM "Participant" ORDER BY "createdAt" DESC
    `;
    console.log('Participantes obtenidos:', participants.length);
    return NextResponse.json(participants);
  } catch (error: any) {
    console.error('ERROR CRITICO ADMIN:', error);
    return NextResponse.json({ error: 'Error al obtener participantes', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    await sql`
      DELETE FROM "Participant" WHERE id = ${Number(id)}
    `;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar registro' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id, name, surname, dni, email, phone, ticket, branch, amount } = await request.json();

    if (!id || !name || !surname || !dni || !ticket || !branch) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    await sql`
      UPDATE "Participant"
      SET 
        name = ${name},
        surname = ${surname},
        dni = ${dni},
        email = ${email || ''},
        phone = ${phone || ''},
        ticket = ${ticket},
        branch = ${branch},
        amount = ${amount || null}
      WHERE id = ${Number(id)}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('ERROR AL EDITAR PARTICIPANTE:', error);
    return NextResponse.json({ error: 'Error al editar registro', details: error.message }, { status: 500 });
  }
}

