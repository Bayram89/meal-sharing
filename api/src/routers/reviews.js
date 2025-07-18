import express from "express";
import knex, { knexRawQuery } from "../database_client.js";

const reviewsRouter = express.Router();

// ADD a NEW REVIEW TO THE DATABASE
reviewsRouter.post("/", async (req, res) => {
  try {
    const { stars, meal_id: mealId, title, description } = req.body;

    // Insert new review with stars, meal_id, title, and description
    const insertQuery = `INSERT INTO Review (stars, meal_id, title, description) VALUES (?, ?, ?, ?) RETURNING *`;
    const newReview = await knexRawQuery(insertQuery, [
      stars,
      mealId,
      title,
      description,
    ]);
    res.json(newReview[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// UPDATE A REVIEW
reviewsRouter.put("/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    const stars = req.body.stars;

    // SQL query to update the review
    const updateQuery = `UPDATE Review SET stars = ${stars} WHERE id = ${reviewId} RETURNING *`;

    // Execute the update query and get the updated review
    const updatedReview = await knexRawQuery(updateQuery);

    // Send the updated review as a response
    res.json(updatedReview[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// DELETE A REVIEW
reviewsRouter.delete("/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;

    // The SQL to delete the review
    const deleteQuery = `DELETE FROM Review WHERE id = ${reviewId}`;

    // We run the delete query
    await knex.raw(deleteQuery);

    // Send a success response to let the user know the review was deleted
    res.status(204).send(); // 204 No Content is a common response for successful DELETE requests
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET ALL REVIEWS
reviewsRouter.get("/", async (req, res) => {
  try {
    const reviewQuery = `SELECT * FROM Review`;
    const reviews = await knexRawQuery(reviewQuery);
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET A REVIEW BY ID
reviewsRouter.get("/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;

    const reviewQuery = `SELECT * FROM Review WHERE id = ${reviewId}`;
    const review = await knexRawQuery(reviewQuery);
    if (!review || review.length === 0) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

reviewsRouter.get("/meals/:meal_id", async (req, res) => {
  try {
    const mealId = req.params.meal_id;

    const reviewsQuery = `SELECT * FROM Review WHERE meal_id = ${mealId}`;
    const reviews = await knexRawQuery(reviewsQuery);
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for this meal" });
    }

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default reviewsRouter;
