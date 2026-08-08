import { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import { Order } from "../../domain/entities/Order";
import { ListOrdersInput } from "../dtos/OrderDTOs";
import { PaginationOptions, PaginatedResult } from "@/shared/domain/types/PaginatedResult";

export class ListOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(input: ListOrdersInput, userId: string): Promise<PaginatedResult<Order>> {
    const pagination: PaginationOptions = { page: input.page, limit: input.limit };
    if (input.type === "buying") {
      return this.orderRepository.findByBuyerIdPaginated(userId, pagination);
    }
    return this.orderRepository.findBySellerIdPaginated(userId, pagination);
  }
}
