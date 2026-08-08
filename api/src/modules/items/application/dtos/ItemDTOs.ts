import { z } from "zod";
import { ItemType } from "../../domain/enums/ItemType";
import { ItemStatus } from "../../domain/enums/ItemStatus";
import { ItemCondition } from "../../domain/enums/ItemCondition";
import { ItemCategory } from "../../domain/enums/ItemCategory";



export const createItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  type: z.enum(ItemType, { message: "Type must be 'sale' or 'donation'" }),
  condition: z.enum(ItemCondition, {
    message: "Condition must be 'NEW' or 'USED'",
  }),
  category: z.enum(ItemCategory, {
    message: "Invalid category",
  }),
  imageUrl: z.string().url().optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;



export const updateItemSchema = z.object({
  name: z.string().min(1, "Name must not be empty").optional(),
  description: z.string().min(1, "Description must not be empty").optional(),
  price: z.number().positive("Price must be positive").optional(),
  type: z
    .enum(ItemType, { message: "Type must be 'sale' or 'donation'" })
    .optional(),
  status: z
    .enum(ItemStatus, {
      message: "Status must be 'available', 'reserved' or 'selled'",
    })
    .optional(),
  condition: z
    .enum(ItemCondition, { message: "Condition must be 'NEW' or 'USED'" })
    .optional(),
  category: z.enum(ItemCategory, { message: "Invalid category" }).optional(),
  imageUrl: z.string().url().optional(),
});

export type UpdateItemInput = z.infer<typeof updateItemSchema>;



export const itemIdParamSchema = z.object({
  id: z.uuid("Invalid UUID format"),
});

export type ItemIdParam = z.infer<typeof itemIdParamSchema>;



export const listItemsQuerySchema = z.object({
  category: z.enum(ItemCategory, { message: "Invalid category" }).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type ListItemsQuery = z.infer<typeof listItemsQuerySchema>;
