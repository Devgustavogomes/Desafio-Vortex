import { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import { IItemRepository } from "../../../items/domain/repositories/IItemRepository";
import { Order } from "../../domain/entities/Order";
import { ItemStatus } from "../../../items/domain/enums/ItemStatus";
import { OrderType } from "../../domain/enums/OrderType";
import { NotFoundError } from "@/shared/errors/NotFoundError";
import { ForbiddenError } from "@/shared/errors/ForbiddenError";
import { ConflictError } from "@/shared/errors/ConflictError";
import { CreateOrderInput } from "../dtos/OrderDTOs";

export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly itemRepository: IItemRepository
  ) {}

  async execute(input: CreateOrderInput, buyerId: string): Promise<Order> {
    const item = await this.itemRepository.findById(input.itemId);

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    if (item.owner === buyerId) {
      throw new ForbiddenError("You cannot order your own item");
    }

    if (item.status !== ItemStatus.AVAILABLE) {
      throw new ConflictError(`Item is not available for order. Current status: ${item.status}`);
    }

    item.reserve();
    
    await this.itemRepository.update(item.id, item);

    const orderType = item.type === "sale" ? OrderType.SALE : OrderType.DONATION;

    const order = Order.create({
      buyerId,
      sellerId: item.owner,
      itemId: item.id,
      price: item.price,
      type: orderType,
    });

    return this.orderRepository.create(order);
  }
}
