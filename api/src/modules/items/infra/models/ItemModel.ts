import mongoose, { Schema, Document } from "mongoose";

export interface IItemDocument extends Document<string> {
  _id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  status: string;
  condition: string;
  owner: string;
  imageUrl?: string;
}

const itemSchema = new Schema<IItemDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ["sale", "donation"], required: true },
    status: {
      type: String,
      enum: ["available", "reserved", "selled"],
      default: "available",
      required: true,
    },
    condition: {
      type: String,
      enum: ["NEW", "USED"],
      required: true,
    },
    owner: { type: String, required: true },
    imageUrl: { type: String, required: false },
  },
  { timestamps: true },
);

export const ItemModel = mongoose.model<IItemDocument>("Item", itemSchema);
