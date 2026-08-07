import { IItemRepository } from "../../domain/repositories/IItemRepository";
import { Item } from "../../domain/entities/Item";

export class ListUserItemsUseCase {
  constructor(private readonly repository: IItemRepository) {}

  async execute(userId: string): Promise<Item[]> {
    return this.repository.findByOwner(userId);
  }
}
