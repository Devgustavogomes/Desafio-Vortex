import mongoose, { Schema, Document } from "mongoose";

export interface IOrderDocument extends Document<string> {
  _id: string;
  buyerId: string;
  sellerId: string;
  itemId: string;
  status: string;
  price: number;
  type: string;
}

const orderSchema = new Schema<IOrderDocument>(
  {
    _id: { type: String, required: true },
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    itemId: { type: String, required: true },
    status: {
      type: String,
      enum: ["waiting", "accepted", "rejected"],
      required: true,
    },
    price: { type: Number, required: true },
    type: { type: String, enum: ["sale", "donation"], required: true },
  },
  { timestamps: true },
);

export const OrderModel = mongoose.model<IOrderDocument>("Order", orderSchema);
