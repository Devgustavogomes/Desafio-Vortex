import { z } from "zod";

export const createOrderSchema = z.object({
  itemId: z.uuid("Invalid UUID format"),
});

export const listOrdersSchema = z.object({
  type: z.enum(["buying", "selling"], {
    message: "Type must be 'buying' or 'selling'",
  }),
});

export type ListOrdersInput = z.infer<typeof listOrdersSchema>;

export const orderIdParamSchema = z.object({
  id: z.uuid("Invalid UUID format"),
});

export const updateOrderSchema = z.object({
  action: z.enum(["accept", "reject"], {
    message: "Action must be 'accept' or 'reject'",
  }),
});

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
