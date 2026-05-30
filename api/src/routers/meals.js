import express from "express";
import knex from "../database_client.js";

const mealsRouter = express.Router();

const mealGroupByColumns = [
  "meal.id",
  "meal.title",
  "meal.description",
  "meal.location",
  "meal.image",
  "meal.host_name",
  "meal.when",
  "meal.max_reservations",
  "meal.price",
  "meal.created_date",
];

const withReservationSummary = (query) =>
  query
    .leftJoin("reservation", "meal.id", "reservation.meal_id")
    .groupBy(mealGroupByColumns)
    .select("meal.*")
    .select(
      knex.raw(
        "COALESCE(SUM(reservation.number_of_guests), 0) AS reserved_seats"
      )
    );

const applyAvailabilityFilter = (query, availableReservations) => {
  if (availableReservations === "true" || availableReservations === "false") {
    withReservationSummary(query);

    const comparator = availableReservations === "true" ? ">" : "<=";
    query.havingRaw(
      `meal.max_reservations ${comparator} COALESCE(SUM(reservation.number_of_guests), 0)`
    );
  }

  return query;
};

mealsRouter.get("/", async (req, res) => {
  try {
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

    let query = knex("meal");

    if (maxPrice) {
      query = query.where("price", "<=", Number(maxPrice));
    }

    if (title) {
      query = query.where((builder) => {
        builder
          .whereILike("title", `%${title}%`)
          .orWhereILike("description", `%${title}%`)
          .orWhereILike("location", `%${title}%`)
          .orWhereILike("host_name", `%${title}%`);
      });
    }

    if (dateAfter) {
      query = query.where("when", ">", dateAfter);
    }

    if (dateBefore) {
      query = query.where("when", "<", dateBefore);
    }

    if (availableReservations !== "true" && availableReservations !== "false") {
      query = withReservationSummary(query);
    }

    query = applyAvailabilityFilter(query, availableReservations);

    if (sortKey) {
      const allowedKeys = ["price", "when", "max_reservations"];
      if (allowedKeys.includes(sortKey)) {
        query = query.orderBy(sortKey, sortDir === "desc" ? "desc" : "asc");
      }
    }

    if (limit) {
      query = query.limit(Number(limit));
    }

    const meals = await query;

    if (!meals.length) {
      return res.status(404).json({ error: "No meals found" });
    }

    res.json(meals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

mealsRouter.get("/future-meals", async (req, res) => {
  try {
    const futureMeals = await knex("meal").where("when", ">", knex.fn.now());

    if (!futureMeals.length) {
      return res.status(404).json({ error: "No future meal found" });
    }

    res.json(futureMeals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

mealsRouter.get("/past-meals", async (req, res) => {
  try {
    const pastMeals = await knex("meal").where("when", "<", knex.fn.now());

    if (!pastMeals.length) {
      return res.status(404).json({ error: "No past meal found" });
    }

    res.json(pastMeals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

mealsRouter.get("/first-meal", async (req, res) => {
  try {
    const firstMeal = await knex("meal").orderBy("id", "asc").first();

    if (!firstMeal) {
      return res.status(404).json({ error: "No first meal found" });
    }

    res.json(firstMeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

mealsRouter.get("/last-meal", async (req, res) => {
  try {
    const lastMeal = await knex("meal").orderBy("id", "desc").first();

    if (!lastMeal) {
      return res.status(404).json({ error: "No last meal found" });
    }

    res.json(lastMeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

mealsRouter.get("/search-meals", async (req, res) => {
  try {
    const { name } = req.query;
    const meals = await knex("meal").whereILike("title", `%${name ?? ""}%`);

    if (!meals.length) {
      return res.status(404).json({ error: "No meals found" });
    }

    res.json(meals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

mealsRouter.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    const [newMeal] = await knex("meal")
      .insert({
        title,
        when: knex.fn.now(),
      })
      .returning("*");

    res.status(201).json(newMeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

mealsRouter.get("/:id", async (req, res) => {
  try {
    const mealId = Number(req.params.id);
    const meal = await knex("meal").where({ id: mealId }).first();

    if (!meal) {
      return res.status(404).json({ error: "No meals found" });
    }

    const reservationCountRow = await knex("reservation")
      .where({ meal_id: mealId })
      .sum({ reserved_guests: "number_of_guests" })
      .first();

    meal.reservationCount = Number(reservationCountRow?.reserved_guests ?? 0);

    res.json(meal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

mealsRouter.put("/:id", async (req, res) => {
  try {
    const mealId = Number(req.params.id);
    const { location } = req.body;
    const [updatedMeal] = await knex("meal")
      .where({ id: mealId })
      .update({ location })
      .returning("*");

    if (!updatedMeal) {
      return res.status(404).json({ error: "No meals found" });
    }

    res.json(updatedMeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

mealsRouter.delete("/:id", async (req, res) => {
  try {
    const deletedRows = await knex("meal").where({ id: Number(req.params.id) }).del();

    if (!deletedRows) {
      return res.status(404).json({ error: "No meals found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default mealsRouter;
