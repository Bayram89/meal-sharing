import express from "express";
import knex, { knexRawQuery } from "../database_client.js";

const reservationsRouter = express.Router();

// 1. Route to get all reservations
reservationsRouter.get("/", async (req, res) => {
  try {
    const reservationQuery = `SELECT * FROM reservation`;
    const reservations = await knexRawQuery(reservationQuery);
    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ error: "No reservations found" });
    }
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 2. Route to add a new reservation (POST)
reservationsRouter.post("/", async (req, res) => {
  try {
    const {
      meal_id,
      contact_phonenumber,
      contact_name,
      contact_email,
      number_of_guests,
    } = req.body;

    const numberOfGuests = number_of_guests || 1;

    // Insert the new reservation into the database using parameterized query to prevent SQL injection
    const insertQuery = `
    INSERT INTO reservation (meal_id, contact_phonenumber, contact_name, contact_email, number_of_guests)
    VALUES (?, ?, ?, ?, ?)
    RETURNING *;
  `;
    const newReservation = await knexRawQuery(insertQuery, [
      meal_id,
      contact_phonenumber,
      contact_name,
      contact_email,
      numberOfGuests,
    ]);

    res.status(201).json(newReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 3. Route to get a reservation by ID
// /reservation/1
// /reservation/2
// path params

reservationsRouter.get("/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const reservationQuery = `SELECT * FROM reservation WHERE id = ${reservationId}`;

    const reservation = await knexRawQuery(reservationQuery);
    if (!reservation || reservation.length === 0) {
      return res.status(404).json({ error: "No reservations found" });
    }
    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 4. Route to update a reservation by ID
reservationsRouter.put("/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;
    const email = req.body.email;

    // Construct the SQL query to update the reservation
    const updateQuery = `UPDATE reservation SET contact_email = '${email}' WHERE id = ${reservationId} RETURNING *`;

    // Execute the update query and get the updated reservation
    const updatedReservation = await knexRawQuery(updateQuery);

    // Send the updated reservation as a response
    res.json(updatedReservation[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 5. Route to delete a reservation by ID
// /api/reservations/:id	DELETE	Deletes the reservation by id

reservationsRouter.delete("/:id", async (req, res) => {
  try {
    const reservationId = req.params.id;
    // Construct the SQL query to delete the meal
    const deleteQuery = `DELETE FROM reservation WHERE id = ${reservationId}`;
    // Execute the delete query
    await knex.raw(deleteQuery);
    // Send a success response
    res.status(204).send(); // 204 No Content is a common response for successful DELETE requests
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default reservationsRouter;
