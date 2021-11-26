const express = require("express");
const dotenv = require("dotenv");
const db = require("./db");
const format = require("pg-format");

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.status(200).send("hello node");
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

app.get("/admin", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM mcms.admin");
    res.send(rows);
  } catch (e) {
    res.send(e);
  }
});

app.get("/student_individual", async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM mcms.student NATURAL JOIN mcms.individual"
    );
    res.send(rows);
  } catch (e) {
    res.send(e);
  }
});

app.get("/student_individual/raw", async (req, res) => {
  try {
    const result = await db.query({
      text: "SELECT * FROM mcms.student NATURAL JOIN mcms.individual",
      rowMode: "array",
    });
    res.send(result);
  } catch (e) {
    res.send(e);
  }
});

app.get("/teacher_individual", async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT * FROM mcms.teacher NATURAL JOIN mcms.individual"
    );
    res.send(rows);
  } catch (e) {
    res.send(e);
  }
});

app.get("/teacher_individual/raw", async (req, res) => {
  try {
    const result = await db.query({
      text: "SELECT * FROM mcms.teacher NATURAL JOIN mcms.individual",
      rowMode: "array",
    });
    res.send(result);
  } catch (e) {
    res.send(e);
  }
});

const tables = [
  "individual",
  "student",
  "teacher",
  "admin",
  "course",
  "competition",
  "judge",
  "spectator",
  "enquirer",
  "competition_result",
  "teaches",
  "studies",
  "participates",
  "course_schedules",
  "course_instruments",
  "competition_prizes",
];

app.get("/:table", async (req, res) => {
  if (tables.indexOf(req.params.table) == -1) {
    res.status(400).send("Bad request");
  }
  try {
    const query = format("SELECT * FROM mcms.%I", req.params.table);
    const { rows } = await db.query(query);
    res.status(200).send(rows);
  } catch (e) {
    res.send(e);
  }
});

app.get("/:table/raw", async (req, res) => {
  if (tables.indexOf(req.params.table) == -1) {
    res.status(400).send("Bad request");
  }
  try {
    const query = format("SELECT * FROM mcms.%I", req.params.table);
    const { rows } = await db.query({ text: query, rowMode: "array" });
    res.status(200).send(rows);
  } catch (e) {
    res.send(e);
  }
});

app.delete("/admin/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      "DELETE FROM mcms.admin WHERE admin_id = $1 RETURNING *",
      [req.params.id]
    );
    res.status(200).send(results);
  } catch (e) {
    res.send(e);
  }
});

app.post("/admin", async (req, res) => {
  try {
    const { rows } = await db.query(
      "INSERT INTO mcms.admin (admin_id, name, phone_number) VALUES ($1, $2, $3) RETURNING *",
      [req.body.admin_id, req.body.name, req.body.phone_number]
    );
    res.send(rows);
  } catch (e) {
    res.send(e);
  }
});

app.post("/admin/:id", async (req, res) => {
  try {
    const { rows } = await db.query(
      "UPDATE mcms.admin SET admin_id = $1, name = $2, phone_number = $3 WHERE admin_id = $4 RETURNING *",
      [req.body.admin_id, req.body.name, req.body.phone_number, req.params.id]
    );
    res.status(200).send(rows);
  } catch (e) {
    res.send(e);
  }
});
