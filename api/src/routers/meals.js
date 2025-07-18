import express from "express";
import knex from "../database_client.js";

const mealsRouter = express.Router();

//1. Our main route: a GET request to fetch all meals, and also with different filtering and sorting
mealsRouter.get("/", async (req, res) => {
  try {
    // Here we get query parameters from the request
    const {
      maxPrice,
      availableReservations,
      title,
      dateAfter,
      dateBefore,
      limit,
      sortKey,
      sortDir,
    } = req.query;

    // We set up a database query to fetch meals (for the meal table)
    let query = knex("meal");

    // There's a max price, so here shows meals equal to or cheaper than that
    if (maxPrice) {
      // Filter meals with a price less than maxPrice
      query = query.where("price", "<=", Number(maxPrice));
    }
    // For speicif title we find those meals in their name
    if (title) {
      query = query.where("title", "like", `%${title}%`);
    }
    // If we want to see meals after a certain date
    if (dateAfter) {
      query = query.where("when", ">", dateAfter);
    }
    // And if we want meals before a certain date
    if (dateBefore) {
      query = query.where("when", "<", dateBefore);
    }
    // This is to see the meals that has spots still open
    if (availableReservations === "true") {
      query = query
        .leftJoin("reservation", "meal.id", "=", "reservation.meal_id")
        .groupBy("meal.id")
        .havingRaw(
          "meal.max_reservations > COALESCE(SUM(reservation.number_of_guests), 0)"
        )
        .select("meal.*");

      // To see the meals that are all booked up
    } else if (availableReservations === "false") {
      // Filter meals with no available reservations
      query = query
        .leftJoin("reservation", "meal.id", "=", "reservation.meal_id")
        .groupBy("meal.id")
        .havingRaw(
          "meal.max_reservations <= COALESCE(SUM(reservation.number_of_guests), 0)"
        )
        .select("meal.*");
    }
    // This is to sort meals
    if (sortKey) {
      const allowedKeys = ["price", "when", "max_reservations"];
      if (allowedKeys.includes(sortKey)) {
        const direction = sortDir === "desc" ? "desc" : "asc";
        query = query.orderBy(sortKey, direction);
      }
    }
    // If we want only a number of meals
    if (limit) {
      query = query.limit(Number(limit));
    }

    // Here we run the query and get the meals
    const meals = await query;

    // If we didn't find any, return a 404 error
    if (!meals.length) {
      return res.status(404).json({ error: "No meals found" });
    }

    console.log(meals);

    // Otherwise sending the meals that is found
    res.json(meals);
  } catch (error) {
    // If anything is wrong then log the error
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 2. The route to get all meals in the FUTURE
mealsRouter.get("/future-meals", async (req, res) => {
  const futureMealsQuery = "SELECT * FROM meal WHERE `when` > NOW()";
  const [futureMeals] = await knex.raw(futureMealsQuery);
  if (!futureMeals || futureMeals.length === 0) {
    return res.status(404).json({ error: "No future meal found" });
  }
  res.json(futureMeals);
});

// 3. The route to get all meals in the PAST
mealsRouter.get("/past-meals", async (req, res) => {
  const pastMealsQuery = "SELECT * FROM meal WHERE `when` < NOW()";
  const [pastMeals] = await knex.raw(pastMealsQuery);
  if (!pastMeals || pastMeals.length === 0) {
    return res.status(404).json({ error: "No past meal found" });
  }
  res.json(pastMeals);
});

// 4. The route to get the FIRST meal
mealsRouter.get("/first-meal", async (req, res) => {
  const firstMealQuery = "SELECT * FROM meal ORDER BY id LIMIT 1";
  const [firstMeal] = await knex.raw(firstMealQuery);
  if (!firstMeal || firstMeal.length === 0) {
    return res.status(404).json({ error: "No first meal found" });
  }
  res.json(firstMeal);
});

// 5. The route to get the LAST meal
mealsRouter.get("/last-meal", async (req, res) => {
  const lastMealQuery = "SELECT * FROM meal ORDER BY id DESC LIMIT 1";
  const [lastMeal] = await knex.raw(lastMealQuery);
  if (!lastMeal || lastMeal.length === 0) {
    return res.status(404).json({ error: "No last meal found" });
  }
  res.json(lastMeal);
});

// 1. Search - meals by name
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
  const [meal] = await knex.raw(mealQuery);
  if (!meal || meal.length === 0) {
    return res.status(404).json({ error: "No meals found" });
  }
  res.json(meal);
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
  try {
    const mealId = req.params.id;
    const mealQuery = `SELECT * FROM meal WHERE id = ${mealId}`;
    const [meals] = await knex.raw(mealQuery);
    const [firstMealRetrieved] = meals;

    if (!firstMealRetrieved) {
      return res.status(404).json({ error: "No meals found" });
    }

    const reservationsCountQuery = `SELECT COUNT(*) AS reservationCount FROM reservation WHERE meal_id = ${mealId}`;
    const [countResult] = await knex.raw(reservationsCountQuery);
    const reservationCount = countResult[0]?.reservationCount || 0;

    firstMealRetrieved.reservationCount = reservationCount;
    
console.log(firstMealRetrieved);


    res.json(firstMealRetrieved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
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
