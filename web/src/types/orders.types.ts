export type OrderStatus = "waiting" | "accepted" | "rejected";

export type OrderType = "sale" | "donation";

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string | null;
  buyerEmail: string | null;
  sellerId: string;
  sellerName: string | null;
  sellerEmail: string | null;
  itemId: string;
  status: OrderStatus;
  price: number;
  type: OrderType;
}
