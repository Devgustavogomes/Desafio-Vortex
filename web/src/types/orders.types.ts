export type OrderStatus = "waiting" | "accepted" | "rejected";

export type OrderType = "sale" | "donation";

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  itemId: string;
  status: OrderStatus;
  price: number;
  type: OrderType;
}
