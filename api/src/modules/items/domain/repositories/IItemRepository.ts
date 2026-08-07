import { Item } from "../entities/Item";
import { ItemCategory } from "../enums/ItemCategory";

export interface ItemFilters {
  categories?: ItemCategory[];
}

export interface IItemRepository {
  create(item: Item): Promise<Item>;
  findById(id: string): Promise<Item | null>;
  findAll(filters?: ItemFilters): Promise<Item[]>;
  findByOwner(ownerId: string): Promise<Item[]>;
  update(id: string, item: Item): Promise<Item | null>;
  delete(id: string): Promise<void>;
}
