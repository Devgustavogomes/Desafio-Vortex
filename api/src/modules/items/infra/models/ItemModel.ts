import mongoose, { Schema, Document } from "mongoose";
import { ItemCategory, ItemStatus, ItemType } from "../../domain/enums";
import { ItemCondition } from "../../domain/enums/ItemCondition";

export interface IItemDocument extends Document<string> {
  _id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  status: string;
  condition: string;
  category: string;
  owner: string;
  imageUrl?: string;
}

const itemSchema = new Schema<IItemDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ItemType, required: true },
    status: {
      type: String,
      enum: ItemStatus,
      default: ItemStatus.AVAILABLE,
      required: true,
    },
    condition: {
      type: String,
      enum: ItemCondition,
      required: true,
    },
    category: {
      type: String,
      enum: ItemCategory,
      required: true,
    },
    owner: { type: String, required: true },
    imageUrl: { type: String, required: false },
  },
  { timestamps: true },
);

export const ItemModel = mongoose.model<IItemDocument>("Item", itemSchema);
