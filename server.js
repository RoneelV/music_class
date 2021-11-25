const express = require("express");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());

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

const functions = ["show_student_schedule", "show_teacher_schedule"];

const test_tables = ["studies", "teaches", "judge"];

test_tables.forEach((table) => {
  app.get("/" + table, async (req, res) => {
    try {
      const { rows } = await db.query("SELECT * FROM mcms.$1", [table]);
      res.status(200).send(rows);
    } catch (e) {
      res.send(e);
    }
  });
});

app.get("/:table", async (req, res) => {
  if (tables.indexOf(req.params.table) == -1) {
    res.status(400).send("Bad request");
  }
  try {
    const { rows } = await db.query("SELECT * FROM mcms.$1", [
      req.params.table,
    ]);
    res.status(200).send(rows);
  } catch (e) {
    res.send(e);
  }
});

app.delete("/admin/:id", async (req, res) => {
  try {
    const results = await db.query(
      "DELETE FROM mcms.admin WHERE admin_id = $1",
      [req.params.id]
    );
    res.status(200).send(results);
  } catch (e) {
    res.send(e);
  }
});

app.post("/admin/", async (req, res) => {
  try {
    parseInt(req.body.admin_id);
    console.log(req.body);
    const results = await db.query(
      "INSERT INTO mcms.admin (admin_id, name, phone_number) VALUES ($1, $2, $3)",
      [req.body.admin_id, req.body.name, req.body.phone_number]
    );
    res.send(results);
  } catch (e) {
    res.send(e);
  }
});
