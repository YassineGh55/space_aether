import { pgTable, text, timestamp, uuid, integer, pgEnum, doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const flightStatusEnum = pgEnum("flight_status", ["scheduled", "boarding", "departed", "arrived", "cancelled"]);
export const bookingStatusEnum = pgEnum("booking_status", ["confirmed", "cancelled"]);
export const cabinClassEnum = pgEnum("cabin_class", ["economy", "business", "orbital"]);

export const rockets = pgTable("rockets", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  capacity: integer("capacity").notNull(),
  imageUrl: text("image_url"),
  description: text("description"),
});

export const destinations = pgTable("destinations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  body: text("body").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  distanceAu: doublePrecision("distance_au").notNull(),
  travelDays: integer("travel_days").notNull(),
});

export const flights = pgTable("flights", {
  id: uuid("id").defaultRandom().primaryKey(),
  flightNumber: text("flight_number").notNull().unique(),
  rocketId: uuid("rocket_id").references(() => rockets.id).notNull(),
  originId: uuid("origin_id").references(() => destinations.id).notNull(),
  destinationId: uuid("destination_id").references(() => destinations.id).notNull(),
  departureAt: timestamp("departure_at").notNull(),
  arrivalAt: timestamp("arrival_at").notNull(),
  status: flightStatusEnum("status").default("scheduled").notNull(),
  economyPrice: integer("economy_price").notNull(),
  businessPrice: integer("business_price").notNull(),
  orbitalPrice: integer("orbital_price").notNull(),
  seatsTotal: integer("seats_total").notNull(),
  seatsBooked: integer("seats_booked").default(0).notNull(),
});

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  flightId: uuid("flight_id").references(() => flights.id).notNull(),
  cabinClass: cabinClassEnum("cabin_class").notNull(),
  passengers: integer("passengers").default(1).notNull(),
  totalPrice: integer("total_price").notNull(),
  status: bookingStatusEnum("status").default("confirmed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gallery = pgTable("gallery", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  credit: text("credit"),
  category: text("category"),
});

export const flightRelations = relations(flights, ({ one }) => ({
  origin: one(destinations, { fields: [flights.originId], references: [destinations.id] }),
  destination: one(destinations, { fields: [flights.destinationId], references: [destinations.id] }),
  rocket: one(rockets, { fields: [flights.rocketId], references: [rockets.id] }),
}));

export const bookingRelations = relations(bookings, ({ one }) => ({
  flight: one(flights, { fields: [bookings.flightId], references: [flights.id] }),
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
}));