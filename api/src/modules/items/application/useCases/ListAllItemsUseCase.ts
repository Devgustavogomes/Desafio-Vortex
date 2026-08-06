import { IItemRepository, ItemFilters } from "../../domain/repositories/IItemRepository";
import { Item } from "../../domain/entities/Item";

export class ListAllItemsUseCase {
  constructor(private readonly repository: IItemRepository) {}

  async execute(filters?: ItemFilters): Promise<Item[]> {
    return this.repository.findAll(filters);
  }
}
