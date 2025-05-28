import express from "express";
import knex from "../database_client.js";

const contactsRouter = express.Router();

// Get all contacts in a safe way
contactsRouter.get("/", async (req, res) => {
  let query = knex.select("*").from("contacts");

  if ("sort" in req.query) {
    const [field, direction] = req.query.sort.toString().split(" ");

    const validFields = ["first_name", "last_name"];
    const validDirections = ["ASC", "DESC"];

    if (validFields.includes(field) && validDirections.includes(direction)) {
      query = query.orderBy(field, direction);
    } else {
      return res.status(400).json({ error: "Invalid sort parameter" });
    }
  }

  try {
    const data = await query;
    res.json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default contactsRouter;
