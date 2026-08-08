import { Request, Response } from "express";
import { CreateOrderUseCase } from "../../application/useCases/CreateOrderUseCase";
import { ListOrdersUseCase } from "../../application/useCases/ListOrdersUseCase";
import { GetOrderByIdUseCase } from "../../application/useCases/GetOrderByIdUseCase";
import { AcceptOrderUseCase } from "../../application/useCases/AcceptOrderUseCase";
import { RejectOrderUseCase } from "../../application/useCases/RejectOrderUseCase";
import { Order } from "../../domain/entities/Order";
import { IUserRepository } from "@/modules/user/domain/repositories/IUserRepository";

export class OrderController {
  constructor(
    private createOrderUseCase: CreateOrderUseCase,
    private listOrdersUseCase: ListOrdersUseCase,
    private getOrderByIdUseCase: GetOrderByIdUseCase,
    private acceptOrderUseCase: AcceptOrderUseCase,
    private rejectOrderUseCase: RejectOrderUseCase,
    private userRepository: IUserRepository,
  ) {}

  private async toResponse(order: Order) {
    const [buyer, seller] = await Promise.all([
      this.userRepository.findById(order.buyerId),
      this.userRepository.findById(order.sellerId),
    ]);

    return {
      id: order.id,
      buyerId: order.buyerId,
      buyerName: buyer?.name ?? null,
      buyerEmail: buyer?.email ?? null,
      sellerId: order.sellerId,
      sellerName: seller?.name ?? null,
      sellerEmail: seller?.email ?? null,
      itemId: order.itemId,
      status: order.status,
      price: order.price.toFloat(),
      type: order.type,
    };
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const order = await this.createOrderUseCase.execute(req.body, userId);
    res.status(201).json(await this.toResponse(order));
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const type = req.query.type as "buying" | "selling";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const result = await this.listOrdersUseCase.execute({ type, page, limit }, userId);
    const data = await Promise.all(result.data.map((order) => this.toResponse(order)));
    res.status(200).json({
      data,
      meta: result.meta,
    });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const id = req.params.id as string;
    const order = await this.getOrderByIdUseCase.execute(id, userId);
    res.status(200).json(await this.toResponse(order));
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

    res.status(200).json(await this.toResponse(order));
  };
}
