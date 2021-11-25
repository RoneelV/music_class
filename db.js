// import { Pool } from "pg";
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  // host: "localhost",
  // user: "postgres",
  // database: "201901211_db",

  // port: 5432,
  connectionString: process.env.PG_URL,
  // user: process.env.PG_username,
  // host: process.env.PG_host,
  // database: process.env.PG_database,
  // password: process.env.PG_password,
  // port: 5432,
});
console.log(process.env.PG_URL);
module.exports = { query: (text, params) => pool.query(text, params) };
