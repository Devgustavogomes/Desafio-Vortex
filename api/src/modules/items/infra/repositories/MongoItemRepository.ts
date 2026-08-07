import { IItemRepository, ItemFilters } from "../../domain/repositories/IItemRepository";
import { Item } from "../../domain/entities/Item";
import { Price } from "@/shared/domain/valueObjects/Price";
import { ItemType } from "../../domain/enums/ItemType";
import { ItemStatus } from "../../domain/enums/ItemStatus";
import { ItemCondition } from "../../domain/enums/ItemCondition";
import { ItemCategory } from "../../domain/enums/ItemCategory";
import { ItemModel, IItemDocument } from "../models/ItemModel";

export class MongoItemRepository implements IItemRepository {
  /** Converte documento Mongoose → entidade de domínio */
  private toDomain(doc: IItemDocument): Item {
    return Item.restore({
      id: doc._id,
      name: doc.name,
      description: doc.description,
      price: Price.fromCents(doc.price),
      type: doc.type as ItemType,
      status: doc.status as ItemStatus,
      condition: doc.condition as ItemCondition,
      category: doc.category as ItemCategory,
      owner: doc.owner,
      imageUrl: doc.imageUrl,
    });
  }

  /** Converte entidade de domínio → plain object para persistência */
  private toPersistence(item: Item): {
    _id: string;
    name: string;
    description: string;
    price: number;
    type: string;
    status: string;
    condition: string;
    category: string;
    owner: string;
    imageUrl?: string;
  } {
    return {
      _id: item.id,
      name: item.name,
      description: item.description,
      price: item.price.toCents(),
      type: item.type,
      status: item.status,
      condition: item.condition,
      category: item.category,
      owner: item.owner,
      imageUrl: item.imageUrl,
    };
  }

  async create(item: Item): Promise<Item> {
    const doc = await ItemModel.create(this.toPersistence(item));
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<Item | null> {
    const doc = await ItemModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(filters?: ItemFilters): Promise<Item[]> {
    const query: Record<string, unknown> = {
      status: { $nin: [ItemStatus.RESERVED, ItemStatus.SELLED] },
    };

    if (filters?.categories && filters.categories.length > 0) {
      query.category = { $in: filters.categories };
    }

    const docs = await ItemModel.find(query);
    return docs.map((doc) => this.toDomain(doc));
  }

  async findByOwner(ownerId: string): Promise<Item[]> {
    const docs = await ItemModel.find({ owner: ownerId });
    return docs.map((doc) => this.toDomain(doc));
  }

  async update(id: string, item: Item): Promise<Item | null> {
    const doc = await ItemModel.findByIdAndUpdate(
      id,
      this.toPersistence(item),
      { new: true },
    );
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<void> {
    await ItemModel.findByIdAndDelete(id);
  }
}
