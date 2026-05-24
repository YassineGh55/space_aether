import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db/client";
import { users } from "../db/schema";
import { loginSchema, registerSchema } from "@my-app/shared";
import { eq } from "drizzle-orm";

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const existing = await db.query.users.findFirst({ where: eq(users.email, parsed.data.email) });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const [user] = await db.insert(users).values({ ...parsed.data, passwordHash }).returning();

    req.session.userId = user.id;
    res.status(201).json({ data: { id: user.id, email: user.email, name: user.name } });
  } catch (err) { next(err); }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const user = await db.query.users.findFirst({ where: eq(users.email, parsed.data.email) });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    req.session.userId = user.id;
    res.json({ data: { id: user.id, email: user.email, name: user.name } });
  } catch (err) { next(err); }
});

authRouter.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ data: "ok" }));
});

authRouter.get("/me", async (req, res, next) => {
  try {
    if (!req.session.userId) return res.status(401).json({ error: "Not authenticated" });
    const user = await db.query.users.findFirst({ where: eq(users.id, req.session.userId) });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ data: { id: user.id, email: user.email, name: user.name } });
  } catch (err) { next(err); }
});