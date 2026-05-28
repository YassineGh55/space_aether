import { Router } from "express";
import { db } from "../db/client";

export const galleryRouter = Router();

galleryRouter.get("/", async (req, res, next) => {
  try {
    const all = await db.query.gallery.findMany();
    res.json({ data: all });
  } catch (err) { next(err); }
});