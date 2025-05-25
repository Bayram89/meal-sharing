import express from "express";

const reservationsRouter = express.Router();

// 1. Route to get all reservations
reservationsRouter.get("/", async (req, res) => {
  const reservationQuery = `SELECT * FROM reservation`;
  const reservation = await knex.raw(reservationQuery);
  res.json(reservation[0]);
});


// 2. Route to add a new reservation (POST) ?
reservationsRouter.post("/", async (req, res) => {
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

reservationsRouter.get("/:id", async (req, res) => {
  const reservationId = req.params.id;
  const reservationQuery = `SELECT * FROM reservation WHERE id = ${reservationId}`;
  const reservationQuery2 =
    "SELECT * FROM reservation WHERE id = " + reservationId + ";";

  const reservation = await knex.raw(reservationQuery);
    if (!reservation || reservation.length === 0) {
    return res.status(404).json({ error: "No reservations found" });
  }
  res.json(reservation[0]);
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
  const updatedReservation = await knex.raw(selectQuery);

  // Send the updated meal as a response
  res.json(updatedReservation[0]);
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

