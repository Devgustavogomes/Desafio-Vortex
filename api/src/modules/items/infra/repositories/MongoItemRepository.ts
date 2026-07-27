import { IItemRepository } from "../../domain/repositories/IItemRepository";
import { Item } from "../../domain/entities/Item";
import { Price } from "@/shared/domain/valueObjects/Price";
import { ItemType } from "../../domain/enums/ItemType";
import { ItemStatus } from "../../domain/enums/ItemStatus";
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
      owner: doc.owner,
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
    owner: string;
  } {
    return {
      _id: item.id,
      name: item.name,
      description: item.description,
      price: item.price.toCents(),
      type: item.type,
      status: item.status,
      owner: item.owner,
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

  async findAll(): Promise<Item[]> {
    // RNF: não retornar itens com status "reserved" ou "selled"
    const docs = await ItemModel.find({
      status: { $nin: [ItemStatus.RESERVED, ItemStatus.SELLED] },
    });
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
