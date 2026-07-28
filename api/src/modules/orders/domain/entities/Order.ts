import { randomUUID } from "crypto";
import { Price } from "@/shared/domain/valueObjects/Price";
import { OrderStatus, OrderType } from "../enums";

export interface OrderProps {
  buyerId: string;
  sellerId: string;
  itemId: string;
  price: Price;
  type: OrderType;
}

export interface RestoreOrderProps {
  id: string;
  buyerId: string;
  sellerId: string;
  itemId: string;
  status: OrderStatus;
  price: Price;
  type: OrderType;
}

export class Order {
  private _id: string;
  private _buyerId: string;
  private _sellerId: string;
  private _itemId: string;
  private _status: OrderStatus;
  private _price: Price;
  private _type: OrderType;

  private constructor(
    id: string,
    buyerId: string,
    sellerId: string,
    itemId: string,
    status: OrderStatus,
    price: Price,
    type: OrderType,
  ) {
    this._id = id;
    this._buyerId = buyerId;
    this._sellerId = sellerId;
    this._itemId = itemId;
    this._status = status;
    this._price = price;
    this._type = type;
  }

  /** Factory method para criação de um novo pedido.
   * Gera um ID automático e define o status inicial obrigatoriamente como `waiting`. */
  static create(props: OrderProps): Order {
    return new Order(
      randomUUID(),
      props.buyerId,
      props.sellerId,
      props.itemId,
      OrderStatus.WAITING,
      props.price,
      props.type,
    );
  }

  /** Factory method para reconstituir um pedido existente (ex.: vindo do banco de dados). */
  static restore(props: RestoreOrderProps): Order {
    return new Order(
      props.id,
      props.buyerId,
      props.sellerId,
      props.itemId,
      props.status,
      props.price,
      props.type,
    );
  }

  // ─── Getters ────────────────────────────────────────────────────────────────

  get id(): string {
    return this._id;
  }

  get buyerId(): string {
    return this._buyerId;
  }

  get sellerId(): string {
    return this._sellerId;
  }

  get itemId(): string {
    return this._itemId;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get price(): Price {
    return this._price;
  }

  get type(): OrderType {
    return this._type;
  }

  // ─── Métodos de domínio ──────────────────────────────────────────────────────

  /** Aceita o pedido. Só é permitido quando o status é `waiting`. */
  accept(): void {
    if (this._status !== OrderStatus.WAITING) {
      throw new Error(
        `Não é possível aceitar um pedido com status "${this._status}".`,
      );
    }
    this._status = OrderStatus.ACCEPTED;
  }

  /** Rejeita o pedido. Só é permitido quando o status é `waiting`. */
  reject(): void {
    if (this._status !== OrderStatus.WAITING) {
      throw new Error(
        `Não é possível rejeitar um pedido com status "${this._status}".`,
      );
    }
    this._status = OrderStatus.REJECTED;
  }
}
