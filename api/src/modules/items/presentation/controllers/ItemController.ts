import { Request, Response } from "express";
import { CreateItemUseCase } from "../../application/useCases/CreateItemUseCase";
import { ListAllItemsUseCase } from "../../application/useCases/ListAllItemsUseCase";
import { GetItemByIdUseCase } from "../../application/useCases/GetItemByIdUseCase";
import { UpdateItemUseCase } from "../../application/useCases/UpdateItemUseCase";
import { DeleteItemUseCase } from "../../application/useCases/DeleteItemUseCase";
import { Item } from "../../domain/entities/Item";

export class ItemController {
  constructor(
    private createItemUseCase: CreateItemUseCase,
    private listAllItemsUseCase: ListAllItemsUseCase,
    private getItemByIdUseCase: GetItemByIdUseCase,
    private updateItemUseCase: UpdateItemUseCase,
    private deleteItemUseCase: DeleteItemUseCase,
  ) {}

  private toResponse(item: Item) {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price.toFloat(),
      type: item.type,
      status: item.status,
      owner: item.owner,
    };
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;
    const item = await this.createItemUseCase.execute(req.body, userId);
    res.status(201).json(this.toResponse(item));
  };

  listAll = async (_req: Request, res: Response): Promise<void> => {
    const items = await this.listAllItemsUseCase.execute();
    res.status(200).json(items.map((item) => this.toResponse(item)));
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
