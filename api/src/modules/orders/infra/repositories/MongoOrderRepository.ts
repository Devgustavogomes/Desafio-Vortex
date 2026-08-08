import { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import { Order } from "../../domain/entities/Order";
import { Price } from "@/shared/domain/valueObjects/Price";
import { OrderType, OrderStatus } from "../../domain/enums";
import { OrderModel, IOrderDocument } from "../models/OrderModel";
import { PaginationOptions, PaginatedResult } from "@/shared/domain/types/PaginatedResult";

export class MongoOrderRepository implements IOrderRepository {
  private toDomain(doc: IOrderDocument): Order {
    return Order.restore({
      id: doc._id,
      buyerId: doc.buyerId,
      sellerId: doc.sellerId,
      itemId: doc.itemId,
      status: doc.status as OrderStatus,
      price: Price.fromCents(doc.price),
      type: doc.type as OrderType,
    });
  }

  private toPersistence(order: Order): {
    _id: string;
    buyerId: string;
    sellerId: string;
    itemId: string;
    status: string;
    price: number;
    type: string;
  } {
    return {
      _id: order.id,
      buyerId: order.buyerId,
      sellerId: order.sellerId,
      itemId: order.itemId,
      status: order.status,
      price: order.price.toCents(),
      type: order.type,
    };
  }

  async create(order: Order): Promise<Order> {
    const doc = await OrderModel.create(this.toPersistence(order));
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<Order | null> {
    const doc = await OrderModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findByBuyerIdPaginated(
    buyerId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Order>> {
    const query = { buyerId };
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      OrderModel.find(query).sort({ _id: -1 }).skip(skip).limit(limit),
      OrderModel.countDocuments(query),
    ]);

    return {
      data: docs.map((doc) => this.toDomain(doc)),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySellerIdPaginated(
    sellerId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Order>> {
    const query = { sellerId };
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      OrderModel.find(query).sort({ _id: -1 }).skip(skip).limit(limit),
      OrderModel.countDocuments(query),
    ]);

    return {
      data: docs.map((doc) => this.toDomain(doc)),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async update(id: string, order: Order): Promise<Order | null> {
    const doc = await OrderModel.findByIdAndUpdate(
      id,
      this.toPersistence(order),
      { new: true },
    );
    return doc ? this.toDomain(doc) : null;
  }
}
