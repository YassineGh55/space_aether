import { Router } from "express";
import { db } from "../db/client";

export const destinationsRouter = Router();

destinationsRouter.get("/", async (req, res, next) => {
  try {
    const all = await db.query.destinations.findMany();
    res.json({ data: all });
  } catch (err) { next(err); }
});