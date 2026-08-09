import { IItemRepository } from "../../domain/repositories/IItemRepository";
import { Item } from "../../domain/entities/Item";
import {
  PaginationOptions,
  PaginatedResult,
} from "@/shared/domain/types/PaginatedResult";

export class ListUserItemsUseCase {
  constructor(private readonly repository: IItemRepository) {}

  async execute(userId: string, pagination: PaginationOptions): Promise<PaginatedResult<Item>> {
    return this.repository.findByOwnerPaginated(userId, pagination);
  }
}
