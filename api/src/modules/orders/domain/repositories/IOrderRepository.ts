import { Order } from "../entities/Order";
import {
  PaginationOptions,
  PaginatedResult,
} from "@/shared/domain/types/PaginatedResult";

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByBuyerIdPaginated(
    buyerId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Order>>;
  findBySellerIdPaginated(
    sellerId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Order>>;
  update(id: string, order: Order): Promise<Order | null>;
}
