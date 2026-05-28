import { Router } from "express";
import { db } from "../db/client";
import { flights, destinations, rockets } from "../db/schema";
import { eq } from "drizzle-orm";

export const flightsRouter = Router();

flightsRouter.get("/", async (req, res, next) => {
  try {
    const all = await db.query.flights.findMany({
      with: { origin: true, destination: true, rocket: true },
      orderBy: (f, { asc }) => [asc(f.departureAt)],
    });
    res.json({ data: all });
  } catch (err) { next(err); }
});

flightsRouter.get("/:id", async (req, res, next) => {
  try {
    const flight = await db.query.flights.findFirst({
      where: eq(flights.id, req.params.id),
      with: { origin: true, destination: true, rocket: true },
    });
    if (!flight) return res.status(404).json({ error: "Not found" });
    res.json({ data: flight });
  } catch (err) { next(err); }
});