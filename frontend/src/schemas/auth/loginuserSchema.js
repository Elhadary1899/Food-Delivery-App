// src/schemas/auth/loginSchema.js
import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
