import { z } from "zod";
import { ItemType } from "../../domain/enums/ItemType";
import { ItemStatus } from "../../domain/enums/ItemStatus";

// ─── createItemSchema ──────────────────────────────────────────────────────────

export const createItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  type: z.enum(ItemType, { message: "Type must be 'sale' or 'donation'" }),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;

// ─── updateItemSchema ──────────────────────────────────────────────────────────

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
});

export type UpdateItemInput = z.infer<typeof updateItemSchema>;

// ─── itemIdParamSchema ─────────────────────────────────────────────────────────

export const itemIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"),
});

export type ItemIdParam = z.infer<typeof itemIdParamSchema>;
