require("dotenv").config({ quiet: true });

const fs = require("fs/promises");
const path = require("path");
const mysql = require("mysql2/promise");

async function main() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    throw new Error("Informe o arquivo SQL. Exemplo: node backend/db/run-sql.js backend/db/dump.sql");
  }

  const filePath = path.resolve(process.cwd(), fileArg);
  const sql = await fs.readFile(filePath, "utf8");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
  });

  try {
    await connection.query(sql);
    console.log(`SQL aplicado com sucesso: ${filePath}`);
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error("Falha ao aplicar SQL:", err.message || err);
  process.exit(1);
});
