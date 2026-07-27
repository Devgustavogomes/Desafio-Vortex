import { IItemRepository } from "../../domain/repositories/IItemRepository";
import { Item } from "../../domain/entities/Item";

export class ListAllItemsUseCase {
  constructor(private readonly repository: IItemRepository) {}

  async execute(): Promise<Item[]> {
    // O repositório já filtra itens com status "reserved" e "selled"
    return this.repository.findAll();
  }
}
