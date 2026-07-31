import { api } from "./api";
import type { ItemStatus } from "../components/ui/ItemCard/ItemCard";

export interface ApiItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: "sale" | "donation";
  status: "available" | "reserved" | "selled";
  condition: "NEW" | "USED";
  owner: string;
  imageUrl?: string;
}

export interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  status: ItemStatus;
  imageUrl?: string;
}

export async function fetchShowcaseItems(): Promise<ShowcaseItem[]> {
  try {
    const { data } = await api.get<ApiItem[]>("/items");

    return data.map((item) => {
      let mappedStatus: ItemStatus = "Usado";
      let mappedCategory = item.type === "donation" ? "Doação" : "Venda";

      if (item.status === "reserved") {
        mappedStatus = "Reservado";
      } else if (item.type === "donation") {
        mappedStatus = "Doado";
      } else {
        mappedStatus = item.condition === "NEW" ? "Novo" : "Usado";
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
    console.error("Error fetching items:", error);
    throw error;
  }
}
