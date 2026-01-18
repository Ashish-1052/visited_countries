import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world_capitals",
  password: "Ask@NSK1052!?",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_country");
  console.log("result", result.rows);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(result.rows);
  res.render("index.ejs", { countries: countries, total: countries.length });
});

app.post("/add", async (req, res) => {
  console.log("new country added", req.body.country);
  const result = await db.query("SELECT country_code FROM visited_country WHERE country_code = ($1)", [req.body.country]);
  if (result.rows.length === 0) {
    await db.query("INSERT INTO visited_country (country_code) VALUES ($1)", [req.body.country]);
    res.redirect("/");
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
