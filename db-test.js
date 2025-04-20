// db-test.js
require("dotenv").config();
const { Client, Pool } = require("pg");

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// Replace with your actual credentials or use dotenv for neon database
const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    require: true,
  },
});
// local postgres and docker
const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "yourpassword",
  database: "mydb",
});

async function getPoolConnection() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT version()");
    if (result.rows[0]){ 
      console.log(result.rows[0]);
      console.log("Connected to neon database")
    }

  } finally {
    client.release();
  }
}

async function testConnection() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL database successfully!");
  } catch (err) {
    throw Error("❌ Connection failed:", err);
  } finally {
    await client.end();
  }
}

module.exports = { testConnection, getPoolConnection };
