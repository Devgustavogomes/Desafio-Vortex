import { IOrderRepository } from "../../domain/repositories/IOrderRepository";
import { Order } from "../../domain/entities/Order";
import { Price } from "@/shared/domain/valueObjects/Price";
import { OrderType, OrderStatus } from "../../domain/enums";
import { OrderModel, IOrderDocument } from "../models/OrderModel";

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

  async findByBuyerId(buyerId: string): Promise<Order[]> {
    const docs = await OrderModel.find({ buyerId });
    return docs.map((doc) => this.toDomain(doc));
  }

  async findBySellerId(sellerId: string): Promise<Order[]> {
    const docs = await OrderModel.find({ sellerId });
    return docs.map((doc) => this.toDomain(doc));
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
