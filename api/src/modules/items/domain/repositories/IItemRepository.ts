import { Item } from "../entities/Item";
import { ItemCategory } from "../enums/ItemCategory";
import {
  PaginationOptions,
  PaginatedResult,
} from "@/shared/domain/types/PaginatedResult";

export interface ItemFilters {
  category?: ItemCategory;
}

export interface IItemRepository {
  create(item: Item): Promise<Item>;
  findById(id: string): Promise<Item | null>;
  findAllPaginated(
    filters: ItemFilters | undefined,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Item>>;
  findByOwnerPaginated(
    ownerId: string,
    pagination: PaginationOptions,
  ): Promise<PaginatedResult<Item>>;
  update(id: string, item: Item): Promise<Item | null>;
  delete(id: string): Promise<void>;
}
