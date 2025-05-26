import express from "express";
import knex from "../database_client.js";

const reviewsRouter = express.Router();

// ADD a NEW REVIEW TO THE DATABASE
reviewsRouter.post("/", async (req, res) => {
  const stars = req.body.stars;
  const mealId = req.body.meal_id;

  // Here I'm inserting a new review qith only the stars field
  const insertQuery = `INSERT INTO Review (stars, meal_id) VALUES (${stars}, ${mealId})`;
  await knex.raw(insertQuery);

  //Then I get this inserted review
  const selectQuery = `SELECT * FROM Review ORDER BY id DESC LIMIT 1;`;
  const newReview = await knex.raw(selectQuery);
  res.json(newReview[0]);
});

// UPDATE A REVIEW
reviewsRouter.put("/:id", async (req, res) => {
  const reviewId = req.params.id;
  const stars = req.body.stars;

  // Here'sQL query to update the review
  const updateQuery = `UPDATE Review SET stars = ${stars} WHERE id = ${reviewId}`;

  // We make the updated query run down here
  await knex.raw(updateQuery);

  // We're fetching updated review here
  const selectQuery = `SELECT * FROM Review WHERE id = ${reviewId}`;
  const updatedReview = await knex.raw(selectQuery);

  // Send the updated review as a response
  res.json(updatedReview[0]);
});

// DELETE A REVIEW
reviewsRouter.delete("/:id", async (req, res) => {
  const reviewId = req.params.id;

  // The SQL to delete the review
  const deleteQuery = `DELETE FROM Review WHERE id = ${reviewId}`;

  // We run the delete query
  await knex.raw(deleteQuery);

  // Send a success response to let the user know the review was deleted
  res.status(204).send(); // 204 No Content is a common response for successful DELETE requests
});

// GET ALL REVIEWS
reviewsRouter.get("/", async (req, res) => {
  const reviewQuery = `SELECT * FROM Review`;
  const reviews = await knex.raw(reviewQuery);
  res.json(reviews[0]);
});

// GET A REVIEW BY ID
reviewsRouter.get("/:id", async (req, res) => {
  const reviewId = req.params.id;

  const reviewQuery = `SELECT * FROM Review WHERE id = ${reviewId}`;
  const review = await knex.raw(reviewQuery);
  res.json(review[0]);
});

export default reviewsRouter;
