import "dotenv/config";
import express from "express";
import session from "express-session";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { errorHandler } from "./middleware/error";

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
app.get("/api/health", (_, res) => res.json({ status: "ok" }));
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));