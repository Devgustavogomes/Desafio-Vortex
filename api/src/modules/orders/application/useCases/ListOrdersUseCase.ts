import { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import { Order } from "../../domain/entities/Order";
import { ListOrdersInput } from "../dtos/OrderDTOs";

export class ListOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(input: ListOrdersInput, userId: string): Promise<Order[]> {
    if (input.type === "buying") {
      return this.orderRepository.findByBuyerId(userId);
    }
    
    return this.orderRepository.findBySellerId(userId);
  }
}
