import { z } from "zod";

export const userIdParamSchema = z.object({
  id: z.string().uuid("O ID deve ser um UUID válido."),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "O nome não pode ser vazio.").optional(),
  email: z.email("Formato de email inválido.").optional(),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres.")
    .optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
