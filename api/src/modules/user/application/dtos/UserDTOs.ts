import { z } from "zod";

export const UpdateUserSchema = z
  .object({
    name: z.string().min(2, "Name must have at least 2 characters").optional(),
    email: z.string().email("Invalid email format").optional(),
    password: z
      .string()
      .min(6, "Password must have at least 6 characters")
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.email !== undefined ||
      data.password !== undefined,
    {
      message: "At least one field (name, email or password) must be provided",
    },
  );

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
