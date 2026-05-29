import express from "express";
import knex from "../database_client.js";

const reservationsRouter = express.Router();

reservationsRouter.get("/", async (req, res) => {
  try {
    const reservations = await knex("reservation").select("*");

    if (!reservations.length) {
      return res.status(404).json({ error: "No reservations found" });
    }

    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

reservationsRouter.post("/", async (req, res) => {
  try {
    const {
      meal_id,
      contact_phonenumber,
      contact_name,
      contact_email,
      number_of_guests,
    } = req.body;

    const [newReservation] = await knex("reservation")
      .insert({
        meal_id,
        contact_phonenumber,
        contact_name,
        contact_email,
        number_of_guests: number_of_guests || 1,
        created_date: knex.fn.now(),
      })
      .returning("*");

    res.status(201).json(newReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

reservationsRouter.get("/:id", async (req, res) => {
  try {
    const reservation = await knex("reservation")
      .where({ id: Number(req.params.id) })
      .first();

    if (!reservation) {
      return res.status(404).json({ error: "No reservations found" });
    }

    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

reservationsRouter.put("/:id", async (req, res) => {
  try {
    const reservationId = Number(req.params.id);
    const { email } = req.body;

    const [updatedReservation] = await knex("reservation")
      .where({ id: reservationId })
      .update({ contact_email: email })
      .returning("*");

    if (!updatedReservation) {
      return res.status(404).json({ error: "No reservations found" });
    }

    res.json(updatedReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

reservationsRouter.delete("/:id", async (req, res) => {
  try {
    const deletedRows = await knex("reservation")
      .where({ id: Number(req.params.id) })
      .del();

    if (!deletedRows) {
      return res.status(404).json({ error: "No reservations found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default reservationsRouter;
