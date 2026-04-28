import postgres from 'postgres';

async function migrate() {
  const sql = postgres(process.env.DATABASE_URL || '', { ssl: 'require' });
  try {
    await sql`ALTER TABLE "Participant" ADD COLUMN IF NOT EXISTS "amount" TEXT`;
    console.log('Columna amount añadida con éxito');
  } catch (e) {
    console.error('Error al migrar:', e);
  } finally {
    await sql.end();
  }
}

migrate();
