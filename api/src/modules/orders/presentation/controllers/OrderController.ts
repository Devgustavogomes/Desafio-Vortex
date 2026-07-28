import { Request, Response } from "express";
import { CreateOrderUseCase } from "../../application/useCases/CreateOrderUseCase";
import { ListOrdersUseCase } from "../../application/useCases/ListOrdersUseCase";
import { GetOrderByIdUseCase } from "../../application/useCases/GetOrderByIdUseCase";
import { AcceptOrderUseCase } from "../../application/useCases/AcceptOrderUseCase";
import { RejectOrderUseCase } from "../../application/useCases/RejectOrderUseCase";
import { Order } from "../../domain/entities/Order";

export class OrderController {
  constructor(
    private createOrderUseCase: CreateOrderUseCase,
    private listOrdersUseCase: ListOrdersUseCase,
    private getOrderByIdUseCase: GetOrderByIdUseCase,
    private acceptOrderUseCase: AcceptOrderUseCase,
    private rejectOrderUseCase: RejectOrderUseCase,
  ) {}

  private toResponse(order: Order) {
    return {
      id: order.id,
      buyerId: order.buyerId,
      sellerId: order.sellerId,
      itemId: order.itemId,
      status: order.status,
      price: order.price.toFloat(),
      type: order.type,
    };
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const order = await this.createOrderUseCase.execute(req.body, userId);
    res.status(201).json(this.toResponse(order));
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const type = req.query.type as "buying" | "selling";
    const orders = await this.listOrdersUseCase.execute({ type }, userId);
    res.status(200).json(orders.map((order) => this.toResponse(order)));
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const id = req.params.id as string;
    const order = await this.getOrderByIdUseCase.execute(id, userId);
    res.status(200).json(this.toResponse(order));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const id = req.params.id as string;
    const { action } = req.body;

    let order: Order;
    if (action === "accept") {
      order = await this.acceptOrderUseCase.execute(id, userId);
    } else {
      order = await this.rejectOrderUseCase.execute(id, userId);
    }

    res.status(200).json(this.toResponse(order));
  };
}
