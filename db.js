require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.PG_URL,
});

module.exports = { query: (text, params) => pool.query(text, params) };
