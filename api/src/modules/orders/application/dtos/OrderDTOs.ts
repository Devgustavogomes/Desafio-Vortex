import { z } from "zod";

export const createOrderSchema = z.object({
  itemId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const listOrdersSchema = z.object({
  type: z.enum(["buying", "selling"], { message: "Type must be 'buying' or 'selling'" }),
});

export type ListOrdersInput = z.infer<typeof listOrdersSchema>;

export const orderIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
});

export type OrderIdParam = z.infer<typeof orderIdParamSchema>;

export const updateOrderSchema = z.object({
  action: z.enum(["accept", "reject"], { message: "Action must be 'accept' or 'reject'" }),
});

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
