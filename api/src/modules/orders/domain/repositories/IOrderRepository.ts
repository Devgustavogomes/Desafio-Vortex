import { Order } from "../entities/Order";

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByBuyerId(buyerId: string): Promise<Order[]>;
  findBySellerId(sellerId: string): Promise<Order[]>;
  update(id: string, order: Order): Promise<Order | null>;
}
