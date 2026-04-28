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
    const participants = await sql`
      SELECT * FROM "Participant" ORDER BY "createdAt" DESC
    `;
    return NextResponse.json(participants);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener participantes' }, { status: 500 });
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
