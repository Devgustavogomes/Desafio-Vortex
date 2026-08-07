import { api } from "./api";
import type { ItemStatus as UIItemStatus } from "../components/ui/ItemCard/ItemCard";
import {
  type Item,
  type CreateItemInput,
  type UpdateItemInput,
  ItemType,
  ItemCondition,
  ItemStatus,
  ItemCategory,
} from "../types/items.types";

export interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  status: UIItemStatus;
  imageUrl?: string;
}

export async function fetchShowcaseItems(
  categories?: ItemCategory[],
): Promise<ShowcaseItem[]> {
  try {
    const params: Record<string, string> = {};
    if (categories && categories.length > 0) {
      params.category = categories.join(",");
    }

    const { data } = await api.get<Item[]>("/items", { params });

    return data.map((item) => {
      let mappedStatus: UIItemStatus;
      const mappedCategory = item.type === ItemType.DONATION ? "Doação" : "Venda";

      if (item.status === ItemStatus.RESERVED) {
        mappedStatus = "Reservado";
      } else if (item.type === ItemType.DONATION) {
        mappedStatus = "Doado";
      } else {
        mappedStatus = item.condition === ItemCondition.NEW ? "Novo" : "Usado";
      }

      return {
        id: item.id,
        title: item.name,
        category: mappedCategory,
        status: mappedStatus,
        imageUrl: item.imageUrl,
      };
    });
  } catch (error) {
    console.error("Error fetching showcase items:", error);
    throw error;
  }
}

export async function getAllItems(categories?: ItemCategory[]): Promise<Item[]> {
  const params: Record<string, string> = {};
  if (categories && categories.length > 0) {
    params.category = categories.join(",");
  }
  const { data } = await api.get<Item[]>("/items", { params });
  return data;
}

export async function getUserItems(): Promise<Item[]> {
  const { data } = await api.get<Item[]>("/items/me");
  return data;
}

export async function getItemById(id: string): Promise<Item> {
  const { data } = await api.get<Item>(`/items/${id}`);
  return data;
}

export async function createItem(itemData: CreateItemInput): Promise<Item> {
  const { data } = await api.post<Item>("/items", itemData);
  return data;
}

export async function updateItem(
  id: string,
  itemData: UpdateItemInput
): Promise<Item> {
  const { data } = await api.put<Item>(`/items/${id}`, itemData);
  return data;
}

export async function deleteItem(id: string): Promise<void> {
  await api.delete(`/items/${id}`);
}

export async function createOrder(itemId: string): Promise<unknown> {
  const { data } = await api.post("/orders", { itemId });
  return data;
}
