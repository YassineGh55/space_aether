import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { errorHandler } from "./middleware/error";
import { flightsRouter } from "./routes/flights";
import { destinationsRouter } from "./routes/destinations";
import { galleryRouter } from "./routes/gallery";
import { bookingsRouter } from "./routes/bookings";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" }
}));

app.use("/api/auth", authRouter);
app.use("/api/flights", flightsRouter);
app.use("/api/destinations", destinationsRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/bookings", bookingsRouter);
app.get("/api/health", (_, res) => res.json({ status: "ok" }));
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));