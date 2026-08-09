import { Request, Response } from "express";
import { CreateItemUseCase } from "../../application/useCases/CreateItemUseCase";
import { ListAllItemsUseCase } from "../../application/useCases/ListAllItemsUseCase";
import { GetItemByIdUseCase } from "../../application/useCases/GetItemByIdUseCase";
import { UpdateItemUseCase } from "../../application/useCases/UpdateItemUseCase";
import { DeleteItemUseCase } from "../../application/useCases/DeleteItemUseCase";
import { ListUserItemsUseCase } from "../../application/useCases/ListUserItemsUseCase";
import { ItemFilters } from "../../domain/repositories/IItemRepository";
import { ItemCategory } from "../../domain/enums/ItemCategory";
import { Item } from "../../domain/entities/Item";

export class ItemController {
  constructor(
    private createItemUseCase: CreateItemUseCase,
    private listAllItemsUseCase: ListAllItemsUseCase,
    private getItemByIdUseCase: GetItemByIdUseCase,
    private updateItemUseCase: UpdateItemUseCase,
    private deleteItemUseCase: DeleteItemUseCase,
    private listUserItemsUseCase: ListUserItemsUseCase,
  ) {}

  private toResponse(item: Item) {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price.toFloat(),
      type: item.type,
      status: item.status,
      condition: item.condition,
      category: item.category,
      owner: item.owner,
      imageUrl: item.imageUrl,
    };
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const item = await this.createItemUseCase.execute(req.body, userId);
    res.status(201).json(this.toResponse(item));
  };

  listAll = async (req: Request, res: Response): Promise<void> => {
    const filters: ItemFilters = {};

    if (req.query.category) {
      filters.category = req.query.category as ItemCategory;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const result = await this.listAllItemsUseCase.execute(filters, { page, limit });
    res.status(200).json({
      data: result.data.map((item) => this.toResponse(item)),
      meta: result.meta,
    });
  };

  listUserItems = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const result = await this.listUserItemsUseCase.execute(userId, { page, limit });
    res.status(200).json({
      data: result.data.map((item) => this.toResponse(item)),
      meta: result.meta,
    });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const item = await this.getItemByIdUseCase.execute(id);
    res.status(200).json(this.toResponse(item));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const id = req.params.id as string;
    const item = await this.updateItemUseCase.execute(id, req.body, userId);
    res.status(200).json(this.toResponse(item));
  };


  delete = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const id = req.params.id as string;
    await this.deleteItemUseCase.execute(id, userId);
    res.status(204).send();
  };
}
