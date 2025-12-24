import { z } from "zod";

// Define schema for user registration
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .refine((val) => val.endsWith("@gmail.com"), {
      message: "Email must end with @gmail.com",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits"),
  marketing_opt: z.boolean().optional(), // optional
});
