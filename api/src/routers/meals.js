import express from "express";
import knex, { knexRawQuery } from "../database_client.js";

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
  try {
    const futureMealsQuery = "SELECT * FROM meal WHERE `when` > NOW()";
    const futureMeals = await knexRawQuery(futureMealsQuery);
    if (!futureMeals || futureMeals.length === 0) {
      return res.status(404).json({ error: "No future meal found" });
    }
    res.json(futureMeals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 3. The route to get all meals in the PAST
mealsRouter.get("/past-meals", async (req, res) => {
  try {
    const pastMealsQuery = "SELECT * FROM meal WHERE `when` < NOW()";
    const pastMeals = await knexRawQuery(pastMealsQuery);
    if (!pastMeals || pastMeals.length === 0) {
      return res.status(404).json({ error: "No past meal found" });
    }
    res.json(pastMeals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 4. The route to get the FIRST meal
mealsRouter.get("/first-meal", async (req, res) => {
  try {
    const firstMealQuery = "SELECT * FROM meal ORDER BY id LIMIT 1";
    const firstMeal = await knexRawQuery(firstMealQuery);
    if (!firstMeal || firstMeal.length === 0) {
      return res.status(404).json({ error: "No first meal found" });
    }
    res.json(firstMeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 5. The route to get the LAST meal
mealsRouter.get("/last-meal", async (req, res) => {
  try {
    const lastMealQuery = "SELECT * FROM meal ORDER BY id DESC LIMIT 1";
    const lastMeal = await knexRawQuery(lastMealQuery);
    if (!lastMeal || lastMeal.length === 0) {
      return res.status(404).json({ error: "No last meal found" });
    }
    res.json(lastMeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 1. Search - meals by name
// /meals?name=dessert
// /meals?name=chicken
// query params
// /meals?name=chickenxffdate=2023-10-01
mealsRouter.get("/search-meals", async (req, res) => {
  try {
    // /meals?name=dessert
    console.log(req.query);
    const name = req.query.name;
    const mealQuery = `SELECT * FROM meal WHERE title LIKE '%${name}%'`;
    // const mealQuery = "SELECT * FROM meal WHERE name LIKE '%" + name + "%'";
    const meal = await knexRawQuery(mealQuery);
    if (!meal || meal.length === 0) {
      return res.status(404).json({ error: "No meals found" });
    }
    res.json(meal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 2. Route to add a new meal (POST)
mealsRouter.post("/", async (req, res) => {
  try {
    // Extract the title from the request body
    const { title } = req.body;

    // Insert the new meal into the database using a raw SQL query with direct string interpolation
    const insertQuery = `INSERT INTO meal (title, \`when\`) VALUES ('${title}', NOW()) RETURNING *`;
    const newMeal = await knexRawQuery(insertQuery);

    // Send the newly added meal as a response
    res.status(201).json(newMeal[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 3. Route to get a meal by ID
// /meals/1
// /meals/2
// path params

mealsRouter.get("/:id", async (req, res) => {
  try {
    const mealId = req.params.id;
    const mealQuery = `SELECT * FROM meal WHERE id = ${mealId}`;
    const meals = await knexRawQuery(mealQuery);
    const firstMealRetrieved = Array.isArray(meals) ? meals[0] : undefined;

    if (!firstMealRetrieved) {
      return res.status(404).json({ error: "No meals found" });
    }

    const reservationsCountQuery = `SELECT COUNT(*) AS reservationCount FROM reservation WHERE meal_id = ${mealId}`;
    const countData = await knexRawQuery(reservationsCountQuery);
    const reservationCount =
      (Array.isArray(countData) ? countData[0] : countData)?.reservationCount ||
      0;

    firstMealRetrieved.reservationCount = reservationCount;

    res.json(firstMealRetrieved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 4. Route to update a meal by ID
mealsRouter.put("/:id", async (req, res) => {
  try {
    const mealId = req.params.id;
    const location = req.body.location;

    // Construct the SQL query to update the meal
    const updateQuery = `UPDATE meal SET location = '${location}' WHERE id = ${mealId} RETURNING *`;

    // Execute the update query and get the updated meal
    const updatedMeal = await knexRawQuery(updateQuery);

    // Send the updated meal as a response
    res.json(updatedMeal[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 5. Route to delete a meal by ID
mealsRouter.delete("/:id", async (req, res) => {
  try {
    const mealId = req.params.id;

    // Construct the SQL query to delete the meal
    const deleteQuery = `DELETE FROM meal WHERE id = ${mealId}`;

    // Execute the delete query
    await knex.raw(deleteQuery);

    // Send a success response
    res.status(204).send(); // 204 No Content is a common response for successful DELETE requests
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default mealsRouter;
