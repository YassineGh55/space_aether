import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db/client";
import { users } from "../db/schema";
import { loginSchema, registerSchema, googleAuthSchema } from "@my-app/shared";
import { eq } from "drizzle-orm";
import { getGoogleClient } from "../lib/google";

export const authRouter = Router();

function userResponse(user: { id: string; email: string; name: string }) {
  return { id: user.id, email: user.email, name: user.name };
}

authRouter.post("/register", async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const existing = await db.query.users.findFirst({ where: eq(users.email, parsed.data.email) });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const [user] = await db.insert(users).values({ ...parsed.data, passwordHash }).returning();

    req.session.userId = user.id;
    res.status(201).json({ data: userResponse(user) });
  } catch (err) { next(err); }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const user = await db.query.users.findFirst({ where: eq(users.email, parsed.data.email) });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (!user.passwordHash) return res.status(401).json({ error: "Sign in with Google for this account" });

    const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    req.session.userId = user.id;
    res.json({ data: userResponse(user) });
  } catch (err) { next(err); }
});

authRouter.get("/config", (_req, res) => {
  res.json({ data: { googleEnabled: Boolean(process.env.GOOGLE_CLIENT_ID) } });
});

authRouter.post("/google", async (req, res, next) => {
  try {
    const parsed = googleAuthSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const google = getGoogleClient();
    if (!google) return res.status(503).json({ error: "Google sign-in is not configured" });

    const ticket = await google.verifyIdToken({
      idToken: parsed.data.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload.sub) return res.status(401).json({ error: "Invalid Google token" });

    let user = await db.query.users.findFirst({ where: eq(users.email, payload.email) });

    if (!user) {
      [user] = await db.insert(users).values({
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        googleId: payload.sub,
      }).returning();
    } else if (!user.googleId) {
      [user] = await db.update(users)
        .set({ googleId: payload.sub })
        .where(eq(users.id, user.id))
        .returning();
    } else if (user.googleId !== payload.sub) {
      return res.status(409).json({ error: "Email linked to a different Google account" });
    }

    req.session.userId = user.id;
    res.json({ data: userResponse(user) });
  } catch (err) {
    if (err instanceof Error && err.message.includes("Token used too late")) {
      return res.status(401).json({ error: "Google sign-in expired — please try again" });
    }
    next(err);
  }
});

authRouter.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ data: "ok" }));
});

authRouter.get("/me", async (req, res, next) => {
  try {
    if (!req.session.userId) return res.status(401).json({ error: "Not authenticated" });
    const user = await db.query.users.findFirst({ where: eq(users.id, req.session.userId) });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ data: userResponse(user) });
  } catch (err) { next(err); }
});
