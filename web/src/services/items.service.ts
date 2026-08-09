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
import { type PaginatedResponse } from "../types/pagination.types";

export interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  status: UIItemStatus;
  imageUrl?: string;
}

export async function fetchShowcaseItems(
  category?: ItemCategory,
): Promise<ShowcaseItem[]> {
  try {
    const params: Record<string, string> = {};
    if (category) {
      params.category = category;
    }
    params.page = "1";
    params.limit = "8";

    const { data } = await api.get<PaginatedResponse<Item> | Item[]>("/items", {
      params,
    });
    const itemsList: Item[] = Array.isArray(data) ? data : (data?.data ?? []);

    return itemsList.map((item) => {
      let mappedStatus: UIItemStatus;
      const mappedCategory =
        item.type === ItemType.DONATION ? "Doação" : "Venda";

      if (item.status === ItemStatus.SELLED) {
        mappedStatus = item.type === ItemType.DONATION ? "Doado" : "Vendido";
      } else if (item.status === ItemStatus.RESERVED) {
        mappedStatus = "Reservado";
      } else if (item.type === ItemType.DONATION) {
        mappedStatus = "Doação";
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

export async function getAllItems(
  category?: ItemCategory,
  page: number = 1,
  limit: number = 12,
): Promise<PaginatedResponse<Item>> {
  const params: Record<string, string> = {};
  if (category) {
    params.category = category;
  }
  params.page = String(page);
  params.limit = String(limit);

  const { data } = await api.get<PaginatedResponse<Item> | Item[]>("/items", { params });

  if (Array.isArray(data)) {
    return {
      data,
      meta: {
        total: data.length,
        page,
        limit,
        totalPages: Math.ceil(data.length / limit) || 1,
      },
    };
  }

  return data;
}

export async function getUserItems(
  page: number = 1,
  limit: number = 12,
): Promise<PaginatedResponse<Item>> {
  const { data } = await api.get<PaginatedResponse<Item> | Item[]>("/items/me", {
    params: { page: String(page), limit: String(limit) },
  });

  if (Array.isArray(data)) {
    return {
      data,
      meta: {
        total: data.length,
        page,
        limit,
        totalPages: Math.ceil(data.length / limit) || 1,
      },
    };
  }

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
  itemData: UpdateItemInput,
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
