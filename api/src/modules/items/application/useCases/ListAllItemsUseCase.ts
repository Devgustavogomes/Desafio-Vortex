import { IItemRepository, ItemFilters } from "../../domain/repositories/IItemRepository";
import { Item } from "../../domain/entities/Item";
import { PaginationOptions, PaginatedResult } from "@/shared/domain/types/PaginatedResult";

export class ListAllItemsUseCase {
  constructor(private readonly repository: IItemRepository) {}

  async execute(filters: ItemFilters | undefined, pagination: PaginationOptions): Promise<PaginatedResult<Item>> {
    return this.repository.findAllPaginated(filters, pagination);
  }
}
