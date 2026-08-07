import { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import { Order } from "../../domain/entities/Order";
import { NotFoundError } from "@/shared/errors/NotFoundError";
import { ForbiddenError } from "@/shared/errors/ForbiddenError";

export class GetOrderByIdUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(orderId: string, userId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.buyerId !== userId && order.sellerId !== userId) {
      throw new ForbiddenError("You are not authorized to view this order");
    }

    return order;
  }
}
