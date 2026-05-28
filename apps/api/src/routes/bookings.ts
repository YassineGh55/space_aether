import { Router } from "express";
import { db } from "../db/client";
import { bookings, flights } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { createBookingSchema } from "@my-app/shared";

export const bookingsRouter = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) return res.status(401).json({ error: "Not authenticated" });
  next();
}

bookingsRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const all = await db.query.bookings.findMany({
      where: eq(bookings.userId, req.session.userId!),
      with: { flight: { with: { origin: true, destination: true, rocket: true } } },
      orderBy: (b, { desc }) => [desc(b.createdAt)],
    });
    res.json({ data: all });
  } catch (err) { next(err); }
});

bookingsRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { flightId, cabinClass, passengers } = parsed.data;

    const flight = await db.query.flights.findFirst({ where: eq(flights.id, flightId) });
    if (!flight) return res.status(404).json({ error: "Flight not found" });

    const seatsLeft = flight.seatsTotal - flight.seatsBooked;
    if (seatsLeft < passengers) return res.status(409).json({ error: "Not enough seats" });

    const pricePerSeat = cabinClass === "economy" ? flight.economyPrice : cabinClass === "business" ? flight.businessPrice : flight.orbitalPrice;
    const totalPrice = pricePerSeat * passengers;

    const [booking] = await db.insert(bookings).values({
      userId: req.session.userId!,
      flightId,
      cabinClass,
      passengers,
      totalPrice,
    }).returning();

    await db.update(flights)
      .set({ seatsBooked: sql`${flights.seatsBooked} + ${passengers}` })
      .where(eq(flights.id, flightId));

    res.status(201).json({ data: booking });
  } catch (err) { next(err); }
});

bookingsRouter.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const booking = await db.query.bookings.findFirst({ where: eq(bookings.id, req.params.id) });
    if (!booking || booking.userId !== req.session.userId) return res.status(404).json({ error: "Not found" });

    await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, req.params.id));
    await db.update(flights)
      .set({ seatsBooked: sql`${flights.seatsBooked} - ${booking.passengers}` })
      .where(eq(flights.id, booking.flightId));

    res.json({ data: "cancelled" });
  } catch (err) { next(err); }
});