import { IItemRepository } from "../../domain/repositories/IItemRepository";
import { Item } from "../../domain/entities/Item";
import { NotFoundError } from "@/shared/errors/NotFoundError";

export class GetItemByIdUseCase {
  constructor(private readonly repository: IItemRepository) {}

  async execute(id: string): Promise<Item> {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    return item;
  }
}
