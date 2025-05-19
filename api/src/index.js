import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

// You can delete this route once you add your own routes
apiRouter.get("/", async (req, res) => {
  const users = await knex.raw("select * from hyfparticipants");
  res.send(users[0])
});

  // This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

// A test route to check if the server is running
app.get("/test", (req, res) => {
  res.send("Hello and my api is running");
});

// 1. The route to get all meals in the FUTURE
apiRouter.get("/future-meals", async (req, res) => {
  const futureMealsQuery = "SELECT * FROM meal WHERE `when` > NOW()";
  const [futureMeals] = await knex.raw(futureMealsQuery);
    if (!futureMeals || futureMeals.length === 0) {
    return res.status(404).json({ error: "No meal found" });
  }
  res.json(futureMeals);
});

// 2. The route to get all meals in the PAST
apiRouter.get("/past-meals", async (req, res) => {
  const pastMealsQuery = "SELECT * FROM meal WHERE `when` < NOW()";
  const [pastMeals] = await knex.raw(pastMealsQuery);
    if (!pastMeals || pastMeals.length === 0) {
    return res.status(404).json({ error: "No meal found" });
  }
  res.json(pastMeals);
});

// 3. The route to get all meals sorted by ID
apiRouter.get("/meals", async (req, res) => {
  const mealQuery = "SELECT * FROM meal";
  const [meal] = await knex.raw(mealQuery);
    if (!meal || meal.length === 0) {
    return res.status(404).json({ error: "No meal found" });
  }
  res.json(meal);
});

// 4. The route to get the FIRST meal
apiRouter.get("/first-meal", async (req, res) => {
  const firstMealQuery = "SELECT * FROM meal ORDER BY id LIMIT 1";
  const [firstMeal] = await knex.raw(firstMealQuery);
    if (!firstMeal || firstMeal.length === 0) {
    return res.status(404).json({ error: "No meal found" });
  }
  res.json(firstMeal);
});

// 5. The route to get the LAST meal
apiRouter.get("/last-meal", async (req, res) => {
  const lastMealQuery = "SELECT * FROM meal ORDER BY id DESC LIMIT 1";
  const [lastMeal] = await knex.raw(lastMealQuery);
  if (!lastMeal || lastMeal.length === 0) {
    return res.status(404).json({ error: "No meal found" });
  }
  res.json(lastMeal);
});

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});

