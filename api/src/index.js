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
  res.send(users[0]);
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
  res.json(futureMeals);
});

// 2. The route to get all meals in the PAST
apiRouter.get("/past-meals", async (req, res) => {
  const pastMealsQuery = "SELECT * FROM meal WHERE `when` < NOW()";
  const [pastMeals] = await knex.raw(pastMealsQuery);
  res.json(pastMeals);
});

// 3. The route to get all meals sorted by ID
apiRouter.get("/meals", async (req, res) => {
  const mealQuery = "SELECT * FROM meal";
  const [meal] = await knex.raw(mealQuery);
  res.json(meal);
});

// 4. The route to get the FIRST meal
apiRouter.get("/first-meal", async (req, res) => {
  const firstMealQuery = "SELECT * FROM meal ORDER BY id LIMIT 1";
  const [firstMeal] = await knex.raw(firstMealQuery);
  res.json(firstMeal);
});

// 5. The route to get the LAST meal
apiRouter.get("/last-meal", async (req, res) => {
  const lastMealQuery = "SELECT * FROM meal ORDER BY id DESC LIMIT 1";
  const [lastMeal] = await knex.raw(lastMealQuery);
  res.json(lastMeal);
});

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});

// MEALS

// Search - meals by name
// /meals?name=dessert
// /meals?name=chicken
// query params
// /meals?name=chickenxffdate=2023-10-01
apiRouter.get("/search-meals", async (req, res) => {
  // /meals?name=dessert
  console.log(req.query);
  const name = req.query.name;
  const mealQuery = `SELECT * FROM meal WHERE title LIKE '%${name}%'`;
  // const mealQuery = "SELECT * FROM meal WHERE name LIKE '%" + name + "%'";
  const [meal] = await knex.raw(mealQuery);
  res.json(meal);
});

// 1. Route to get all meals
apiRouter.get("/meals", async (req, res) => {
  const mealQuery = `SELECT * FROM meal`;
  const [meal] = await knex.raw(mealQuery);
  res.json(meal);
});

// 2. Route to add a new meal (POST)
apiRouter.post("/meals", async (req, res) => {
  // Extract the title from the request body
  const title = req.body.title;

  // Insert the new meal into the database using a raw SQL query with direct string interpolation
  const insertQuery = `INSERT INTO meal (title) VALUES ('${title}')`;
  await knex.raw(insertQuery);

  // Retrieve the newly added meal from the database by its title
  const selectQuery = `SELECT * FROM meal WHERE title = '${title}'`;
  const [newMeal] = await knex.raw(selectQuery);

  // Send the newly added meal as a response
  res.status(201).json(newMeal[0]);
});

// 3. Route to get a meal by ID
// /meals/1
// /meals/2
// path params

apiRouter.get("/meals/:id", async (req, res) => {
  const mealId = req.params.id;
  const mealQuery = `SELECT * FROM meal WHERE id = ${mealId}`;
  const mealQuery2 = "SELECT * FROM meal WHERE id = " + mealId + ";";

  const [meal] = await knex.raw(mealQuery);
  res.json(meal);
});

// 4. Route to update a meal by ID
apiRouter.put("/meals/:id", async (req, res) => {
  const mealId = req.params.id;
  const { title } = req.body;

  // Construct the SQL query to update the meal
  const updateQuery = `UPDATE meal SET title = '${title}' WHERE id = ${mealId}`;

  // Execute the update query
  await knex.raw(updateQuery);

  // Retrieve the updated meal from the database
  const selectQuery = `SELECT * FROM meal WHERE id = ${mealId}`;
  const [updatedMeal] = await knex.raw(selectQuery);

  // Send the updated meal as a response
  res.json(updatedMeal[0]);
});

// 5. Route to delete a meal by ID
apiRouter.delete("/meals/:id", async (req, res) => {
  const mealId = req.params.id;

  // Construct the SQL query to delete the meal
  const deleteQuery = `DELETE FROM meal WHERE id = ${mealId}`;

  // Execute the delete query
  await knex.raw(deleteQuery);

  // Send a success response
  res.status(204).send(); // 204 No Content is a common response for successful DELETE requests
});

// RESERVATIONS

// 1. Route to get all reservations
apiRouter.get("/reservations", async (req, res) => {
  const reservationQuery = `SELECT * FROM reservation`;
  const reservation = await knex.raw(reservationQuery);
  res.json(reservation[0]);
});

// 2. Route to add a new reservation (POST) ?
apiRouter.post("/reservations", async (req, res) => {
  // Extract the title from the request body
  const { meal_id } = req.body;

  // Insert the new reservation into the database using a raw SQL query with direct string interpolation
  const insertQuery = `INSERT INTO reservation (meal_id) VALUES (${meal_id})`;
  await knex.raw(insertQuery);

  // Retrieve the newly added reservation from the database by its ID
  const selectQuery = `SELECT * FROM reservation WHERE meal_id = ${meal_id}`;
  const newReservation = await knex.raw(selectQuery);

  // Send the newly added reservation as a response
  res.status(201).json(newReservation[0]);
});

// 3. Route to get a reservation by ID
// /reservation/1
// /reservation/2
// path params

apiRouter.get("/reservations/:id", async (req, res) => {
  const reservationId = req.params.id;
  const reservationQuery = `SELECT * FROM reservation WHERE id = ${reservationId}`;
  const reservationQuery2 =
    "SELECT * FROM reservation WHERE id = " + reservationId + ";";

  const reservation = await knex.raw(reservationQuery);
  res.json(reservation[0]);
});

// 4. Route to update a reservation by ID
apiRouter.put("/reservations/:id", async (req, res) => {
  const reservationId = req.params.id;
  const email = req.body.bayram;

  // Construct the SQL query to update the meal
  const updateQuery = `UPDATE reservation SET contact_email = '${email}' WHERE id = ${reservationId}`;

  // Execute the update query
  await knex.raw(updateQuery);

  // Retrieve the updated meal from the database
  const selectQuery = `SELECT * FROM reservation WHERE id = ${reservationId}`;
  const updatedReservation = await knex.raw(selectQuery);

  // Send the updated meal as a response
  res.json(updatedReservation[0]);
});

// 5. Route to delete a reservation by ID
// /api/reservations/:id	DELETE	Deletes the reservation by id

apiRouter.delete("/reservations/:id", async (req, res) => {
  const reservationId = req.params.id;
  // Construct the SQL query to delete the meal
  const deleteQuery = `DELETE FROM reservation WHERE id = ${reservationId}`;
  // Execute the delete query
  await knex.raw(deleteQuery);
  // Send a success response
  res.status(204).send(); // 204 No Content is a common response for successful DELETE requests
});

// Update ile ilgili 3 tane
// Put post get