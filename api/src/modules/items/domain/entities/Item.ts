import { randomUUID } from "crypto";
import { Price } from "@/shared/domain/valueObjects/Price";
import { ItemType } from "../enums/ItemType";
import { ItemStatus } from "../enums/ItemStatus";
import { ItemCondition } from "../enums/ItemCondition";
import { ItemCategory } from "../enums/ItemCategory";

export interface ItemProps {
  name: string;
  description: string;
  price: Price;
  type: ItemType;
  condition: ItemCondition;
  category: ItemCategory;
  owner: string;
  imageUrl?: string;
}

export interface RestoreItemProps {
  id: string;
  name: string;
  description: string;
  price: Price;
  type: ItemType;
  status: ItemStatus;
  condition: ItemCondition;
  category: ItemCategory;
  owner: string;
  imageUrl?: string;
}

export class Item {
  private _id: string;
  private _name: string;
  private _description: string;
  private _price: Price;
  private _type: ItemType;
  private _status: ItemStatus;
  private _condition: ItemCondition;
  private _category: ItemCategory;
  private _owner: string;
  private _imageUrl?: string;

  private constructor(
    id: string,
    name: string,
    description: string,
    price: Price,
    type: ItemType,
    status: ItemStatus,
    condition: ItemCondition,
    category: ItemCategory,
    owner: string,
    imageUrl?: string,
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._price = price;
    this._type = type;
    this._status = status;
    this._condition = condition;
    this._category = category;
    this._owner = owner;
    this._imageUrl = imageUrl;
  }

  
  static create(props: ItemProps): Item {
    return new Item(
      randomUUID(),
      props.name,
      props.description,
      props.price,
      props.type,
      ItemStatus.AVAILABLE,
      props.condition,
      props.category,
      props.owner,
      props.imageUrl,
    );
  }

  
  static restore(props: RestoreItemProps): Item {
    return new Item(
      props.id,
      props.name,
      props.description,
      props.price,
      props.type,
      props.status,
      props.condition,
      props.category,
      props.owner,
      props.imageUrl,
    );
  }

  

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get price(): Price {
    return this._price;
  }

  get type(): ItemType {
    return this._type;
  }

  get status(): ItemStatus {
    return this._status;
  }

  get condition(): ItemCondition {
    return this._condition;
  }

  get category(): ItemCategory {
    return this._category;
  }

  get owner(): string {
    return this._owner;
  }

  get imageUrl(): string | undefined {
    return this._imageUrl;
  }

  

  set name(value: string) {
    this._name = value;
  }

  set description(value: string) {
    this._description = value;
  }

  set price(value: Price) {
    this._price = value;
  }

  set type(value: ItemType) {
    this._type = value;
  }

  set condition(value: ItemCondition) {
    this._condition = value;
  }

  set category(value: ItemCategory) {
    this._category = value;
  }

  set imageUrl(value: string | undefined) {
    this._imageUrl = value;
  }

  

  
  reserve(): void {
    if (this._status !== ItemStatus.AVAILABLE) {
      throw new Error(
        `Não é possível reservar um item com status "${this._status}".`,
      );
    }
    this._status = ItemStatus.RESERVED;
  }

  
  sell(): void {
    if (this._status !== ItemStatus.RESERVED) {
      throw new Error(
        `Não é possível vender um item com status "${this._status}".`,
      );
    }
    this._status = ItemStatus.SELLED;
  }

  
  markAsAvailable(): void {
    if (this._status !== ItemStatus.RESERVED) {
      throw new Error(
        `Não é possível marcar como disponível um item com status "${this._status}".`,
      );
    }
    this._status = ItemStatus.AVAILABLE;
  }
}
