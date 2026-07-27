import { IItemRepository } from "../../domain/repositories/IItemRepository";
import { Item } from "../../domain/entities/Item";
import { ItemType } from "../../domain/enums/ItemType";
import { Price } from "@/shared/domain/valueObjects/Price";
import { CreateItemInput } from "../dtos/ItemDTOs";

export class CreateItemUseCase {
  constructor(private readonly repository: IItemRepository) {}

  async execute(input: CreateItemInput, userId: string): Promise<Item> {
    const price = Price.fromFloat(input.price);

    // TODO (Task 04): remover cast quando o Zod garantir o tipo de `type`
    const item = Item.create({
      name: input.name,
      description: input.description,
      price,
      type: input.type as ItemType,
      owner: userId,
    });

    return this.repository.create(item);
  }
}
