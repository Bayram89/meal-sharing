import express from "express";
import knex from "../database_client.js";

const reservationsRouter = express.Router();

// 1. Route to get all reservations
reservationsRouter.get("/", async (req, res) => {
  const reservationQuery = `SELECT * FROM reservation`;
  const [reservations] = await knex.raw(reservationQuery);
  if (!reservations || reservations.length === 0) {
    return res.status(404).json({ error: "No reservations found" });
  }
  res.json(reservations);
});

// 2. Route to add a new reservation (POST)
reservationsRouter.post("/", async (req, res) => {
  const { meal_id, contact_phonenumber, contact_name, contact_email } = req.body;

  // Insert the new reservation into the database using parameterized query to prevent SQL injection
  const insertQuery = `
    INSERT INTO reservation (meal_id, contact_phonenumber, contact_name, contact_email)
    VALUES (?, ?, ?, ?)
    RETURNING *;
  `;
  const [newReservation] = await knex.raw(insertQuery, [
    meal_id,
    contact_phonenumber,
    contact_name,
    contact_email,
  ]);

  res.status(201).json(newReservation[0]);
});

// 3. Route to get a reservation by ID
// /reservation/1
// /reservation/2
// path params

reservationsRouter.get("/:id", async (req, res) => {
  const reservationId = req.params.id;
  const reservationQuery = `SELECT * FROM reservation WHERE id = ${reservationId}`;
  const reservationQuery2 =
    "SELECT * FROM reservation WHERE id = " + reservationId + ";";

  const [reservation] = await knex.raw(reservationQuery);
  if (!reservation || reservation.length === 0) {
    return res.status(404).json({ error: "No reservations found" });
  }
  res.json(reservation);
});

// 4. Route to update a reservation by ID
reservationsRouter.put("/:id", async (req, res) => {
  const reservationId = req.params.id;
  const email = req.body.email;

  // Construct the SQL query to update the meal
  const updateQuery = `UPDATE reservation SET contact_email = '${email}' WHERE id = ${reservationId}`;

  // Execute the update query
  await knex.raw(updateQuery);

  // Retrieve the updated meal from the database
  const selectQuery = `SELECT * FROM reservation WHERE id = ${reservationId}`;
  const [updatedReservation] = await knex.raw(selectQuery);

  // Send the updated meal as a response
  res.json(updatedReservation);
});

// 5. Route to delete a reservation by ID
// /api/reservations/:id	DELETE	Deletes the reservation by id

reservationsRouter.delete("/:id", async (req, res) => {
  const reservationId = req.params.id;
  // Construct the SQL query to delete the meal
  const deleteQuery = `DELETE FROM reservation WHERE id = ${reservationId}`;
  // Execute the delete query
  await knex.raw(deleteQuery);
  // Send a success response
  res.status(204).send(); // 204 No Content is a common response for successful DELETE requests
});

export default reservationsRouter;
