require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'whiskerworld',
});

async function test() {
  try {
    const [rows] = await pool.query('SELECT NOW() AS horario');
    console.log('Conectado! Horario do banco:', rows[0]);
  } catch (err) {
    console.error('Erro:', err.message || err.code || err);
  } finally {
    await pool.end();
  }
}

test();
