import { Item } from "../entities/Item";

export interface IItemRepository {
  create(item: Item): Promise<Item>;
  findById(id: string): Promise<Item | null>;
  findAll(): Promise<Item[]>;
  update(id: string, item: Item): Promise<Item | null>;
  delete(id: string): Promise<void>;
}
