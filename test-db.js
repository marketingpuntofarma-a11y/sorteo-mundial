require('dotenv').config();
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL, { 
  ssl: 'require',
  connect_timeout: 10
});

console.log('Probando conexión a:', process.env.DATABASE_URL.split('@')[1]);

sql`SELECT 1`.then(() => {
  console.log('CONEXION_OK');
  process.exit(0);
}).catch(e => {
  console.log('ERROR_DB:', e.message);
  process.exit(1);
});
