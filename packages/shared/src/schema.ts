import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createBookingSchema = z.object({
  flightId: z.string().uuid(),
  cabinClass: z.enum(["economy", "business", "orbital"]),
  passengers: z.number().int().min(1).max(9),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;