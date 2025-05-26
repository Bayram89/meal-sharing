import express from "express";
import knex from "../database_client.js";

const mealsRouter = express.Router();

// 1. The route to get all meals in the FUTURE
mealsRouter.get("/future-meals", async (req, res) => {
  const futureMealsQuery = "SELECT * FROM meal WHERE `when` > NOW()";
  const futureMeals = await knex.raw(futureMealsQuery);
  if (!futureMeals || futureMeals.length === 0) {
    return res.status(404).json({ error: "No future meal found" });
  }
  res.json(futureMeals[0]);
});

// 2. The route to get all meals in the PAST
mealsRouter.get("/past-meals", async (req, res) => {
  const pastMealsQuery = "SELECT * FROM meal WHERE `when` < NOW()";
  const pastMeals = await knex.raw(pastMealsQuery);
  if (!pastMeals || pastMeals.length === 0) {
    return res.status(404).json({ error: "No past meal found" });
  }
  res.json(pastMeals[0]);
});

// 3. The route to get all meals sorted by ID
mealsRouter.get("/", async (req, res) => {
  const mealQuery = "SELECT * FROM meal";
  const meal = await knex.raw(mealQuery);
  if (!meal || meal.length === 0) {
    return res.status(404).json({ error: "No meals found" });
  }
  res.json(meal[0]);
});

// 4. The route to get the FIRST meal
mealsRouter.get("/first-meal", async (req, res) => {
  const firstMealQuery = "SELECT * FROM meal ORDER BY id LIMIT 1";
  const firstMeal = await knex.raw(firstMealQuery);
  if (!firstMeal || firstMeal.length === 0) {
    return res.status(404).json({ error: "No first meal found" });
  }
  res.json(firstMeal[0]);
});

// 5. The route to get the LAST meal
mealsRouter.get("/last-meal", async (req, res) => {
  const lastMealQuery = "SELECT * FROM meal ORDER BY id DESC LIMIT 1";
  const lastMeal = await knex.raw(lastMealQuery);
  if (!lastMeal || lastMeal.length === 0) {
    return res.status(404).json({ error: "No last meal found" });
  }
  res.json(lastMeal[0]);
});

// Search - meals by name
// /meals?name=dessert
// /meals?name=chicken
// query params
// /meals?name=chickenxffdate=2023-10-01
mealsRouter.get("/search-meals", async (req, res) => {
  // /meals?name=dessert
  console.log(req.query);
  const name = req.query.name;
  const mealQuery = `SELECT * FROM meal WHERE title LIKE '%${name}%'`;
  // const mealQuery = "SELECT * FROM meal WHERE name LIKE '%" + name + "%'";
  const meal = await knex.raw(mealQuery);
  res.json(meal[0]);
});

// 2. Route to add a new meal (POST)
mealsRouter.post("/", async (req, res) => {
  // Extract the title from the request body
  const { title } = req.body;

  // Insert the new meal into the database using a raw SQL query with direct string interpolation
  const insertQuery = `INSERT INTO meal (title, \`when\`) VALUES ('${title}', NOW())`;
  await knex.raw(insertQuery);

  // Retrieve the newly added meal from the database by its title
  const selectQuery = `SELECT * FROM meal WHERE title = '${title}'`;
  const newMeal = await knex.raw(selectQuery);

  // Send the newly added meal as a response
  res.status(201).json(newMeal[0]);
});

// 3. Route to get a meal by ID
// /meals/1
// /meals/2
// path params

mealsRouter.get("/:id", async (req, res) => {
  const mealId = req.params.id;
  const mealQuery = `SELECT * FROM meal WHERE id = ${mealId}`;
  const mealQuery2 = "SELECT * FROM meal WHERE id = " + mealId + ";";

  const [meals] = await knex.raw(mealQuery); //
  const [firstMealRetrieved] = meals;
  /*
 [ { } ] 
  */
  if (!firstMealRetrieved) {
    return res.status(404).json({ error: "No meals found" });
  }
  res.json(firstMealRetrieved);
});

// 4. Route to update a meal by ID
mealsRouter.put("/:id", async (req, res) => {
  const mealId = req.params.id;
  const location = req.body.location;

  // Construct the SQL query to update the meal
  const updateQuery = `UPDATE meal SET location = '${location}' WHERE id = ${mealId}`;

  // Execute the update query
  await knex.raw(updateQuery);

  // Retrieve the updated meal from the database
  const selectQuery = `SELECT * FROM meal WHERE id = ${mealId}`;
  const [updatedMeal] = await knex.raw(selectQuery);
  const [firstUpdatedMeal] = updatedMeal;

  // Send the updated meal as a response
  res.json(firstUpdatedMeal);
});

// 5. Route to delete a meal by ID
mealsRouter.delete("/:id", async (req, res) => {
  const mealId = req.params.id;

  // Construct the SQL query to delete the meal
  const deleteQuery = `DELETE FROM meal WHERE id = ${mealId}`;

  // Execute the delete query
  await knex.raw(deleteQuery);

  // Send a success response
  res.status(204).send(); // 204 No Content is a common response for successful DELETE requests
});

export default mealsRouter;
