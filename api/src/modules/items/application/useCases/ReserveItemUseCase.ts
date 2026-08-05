import { IItemRepository } from "../../domain/repositories/IItemRepository";
import { Item } from "../../domain/entities/Item";
import { NotFoundError } from "@/shared/errors/NotFoundError";
import { ForbiddenError } from "@/shared/errors/ForbiddenError";

export class ReserveItemUseCase {
  constructor(private readonly repository: IItemRepository) {}

  async execute(id: string, userId: string): Promise<Item> {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    if (item.owner === userId) {
      throw new ForbiddenError("You cannot reserve your own item");
    }

    item.reserve();

    const updated = await this.repository.update(id, item);

    if (!updated) {
      throw new NotFoundError("Item not found after update");
    }

    return updated;
  }
}
