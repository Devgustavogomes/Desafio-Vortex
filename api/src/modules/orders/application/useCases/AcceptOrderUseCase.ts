import { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import { IItemRepository } from "../../../items/domain/repositories/IItemRepository";
import { Order } from "../../domain/entities/Order";
import { NotFoundError } from "@/shared/errors/NotFoundError";
import { ForbiddenError } from "@/shared/errors/ForbiddenError";

export class AcceptOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly itemRepository: IItemRepository
  ) {}

  async execute(orderId: string, sellerId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.sellerId !== sellerId) {
      throw new ForbiddenError("Only the seller can accept this order");
    }

    order.accept();

    const item = await this.itemRepository.findById(order.itemId);
    
    if (!item) {
      throw new NotFoundError("Related item not found");
    }

    item.sell();

    await this.itemRepository.update(item.id, item);
    const updatedOrder = await this.orderRepository.update(order.id, order);

    if (!updatedOrder) {
      throw new NotFoundError("Order not found after update");
    }

    return updatedOrder;
  }
}
