import { IItemRepository } from "../../domain/repositories/IItemRepository";
import { NotFoundError } from "@/shared/errors/NotFoundError";
import { ForbiddenError } from "@/shared/errors/ForbiddenError";
import { ConflictError } from "@/shared/errors/ConflictError";
import { ItemStatus } from "../../domain/enums/ItemStatus";

export class DeleteItemUseCase {
  constructor(private readonly repository: IItemRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    if (item.owner !== userId) {
      throw new ForbiddenError("You are not the owner of this item");
    }

    if (item.status === ItemStatus.SELLED) {
      throw new ConflictError("Sold items cannot be deleted");
    }

    if (item.status === ItemStatus.RESERVED) {
      throw new ConflictError("Reserved items cannot be deleted");
    }

    await this.repository.delete(id);
  }
}
