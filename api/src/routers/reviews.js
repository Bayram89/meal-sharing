import express from "express";
import knex from "../database_client.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/", async (req, res) => {
  try {
    const { stars, meal_id, title, description } = req.body;
    const [newReview] = await knex("review")
      .insert({
        stars,
        meal_id,
        title,
        description,
        created_date: knex.fn.now(),
      })
      .returning("*");

    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

reviewsRouter.put("/:id", async (req, res) => {
  try {
    const reviewId = Number(req.params.id);
    const { stars } = req.body;
    const [updatedReview] = await knex("review")
      .where({ id: reviewId })
      .update({ stars })
      .returning("*");

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(updatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

reviewsRouter.delete("/:id", async (req, res) => {
  try {
    const deletedRows = await knex("review")
      .where({ id: Number(req.params.id) })
      .del();

    if (!deletedRows) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

reviewsRouter.get("/", async (req, res) => {
  try {
    const reviews = await knex("review").select("*");
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

reviewsRouter.get("/meals/:meal_id", async (req, res) => {
  try {
    const reviews = await knex("review")
      .where({ meal_id: Number(req.params.meal_id) })
      .select("*");

    if (!reviews.length) {
      return res.status(404).json({ error: "No reviews found for this meal" });
    }

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

reviewsRouter.get("/:id", async (req, res) => {
  try {
    const review = await knex("review")
      .where({ id: Number(req.params.id) })
      .first();

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default reviewsRouter;
