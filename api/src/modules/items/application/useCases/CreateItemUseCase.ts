import { IItemRepository } from "../../domain/repositories/IItemRepository";
import { Item } from "../../domain/entities/Item";
import { Price } from "@/shared/domain/valueObjects/Price";
import { CreateItemInput } from "../dtos/ItemDTOs";

export class CreateItemUseCase {
  constructor(private readonly repository: IItemRepository) {}

  async execute(input: CreateItemInput, userId: string): Promise<Item> {
    const price = Price.fromFloat(input.price);

    const item = Item.create({
      name: input.name,
      description: input.description,
      price,
      type: input.type,
      condition: input.condition,
      category: input.category,
      owner: userId,
      imageUrl: input.imageUrl,
    });

    return this.repository.create(item);
  }
}
