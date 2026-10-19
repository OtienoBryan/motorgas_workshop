require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
    multipleStatements: true,
  });
  try {
    const sql = fs.readFileSync(path.join(__dirname, '../database/external-vehicles-tables.sql'), 'utf8');
    await connection.query(sql);
    console.log('✅ external_vehicle_owners and external_vehicles tables are ready');
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
