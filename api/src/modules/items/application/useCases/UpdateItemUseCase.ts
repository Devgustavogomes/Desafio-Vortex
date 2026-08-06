import { IItemRepository } from "../../domain/repositories/IItemRepository";
import { Item } from "../../domain/entities/Item";
import { Price } from "@/shared/domain/valueObjects/Price";
import { NotFoundError } from "@/shared/errors/NotFoundError";
import { ForbiddenError } from "@/shared/errors/ForbiddenError";
import { ConflictError } from "@/shared/errors/ConflictError";
import { UpdateItemInput } from "../dtos/ItemDTOs";
import { ItemStatus } from "../../domain/enums/ItemStatus";

export class UpdateItemUseCase {
  constructor(private readonly repository: IItemRepository) {}

  async execute(
    id: string,
    input: UpdateItemInput,
    userId: string,
  ): Promise<Item> {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new NotFoundError("Item not found");
    }

    if (item.owner !== userId) {
      throw new ForbiddenError("You are not the owner of this item");
    }

    if (item.status === ItemStatus.SELLED) {
      throw new ConflictError("Sold items cannot be updated");
    }

    if (item.status === ItemStatus.RESERVED) {
      throw new ConflictError("Reserved items cannot be updated");
    }

    if (input.name !== undefined) {
      item.name = input.name;
    }

    if (input.description !== undefined) {
      item.description = input.description;
    }

    if (input.price !== undefined) {
      item.price = Price.fromFloat(input.price);
    }

    if (input.type !== undefined) {
      item.type = input.type;
    }

    if (input.condition !== undefined) {
      item.condition = input.condition;
    }

    if (input.category !== undefined) {
      item.category = input.category;
    }

    if (input.imageUrl !== undefined) {
      item.imageUrl = input.imageUrl;
    }

    const updated = await this.repository.update(id, item);

    if (!updated) {
      throw new NotFoundError("Item not found after update");
    }

    return updated;
  }
}
