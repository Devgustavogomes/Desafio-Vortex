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

const API_URL = "http://localhost:3000"; // Base API URL

export async function fetchShowcaseItems(): Promise<ShowcaseItem[]> {
  try {
    const response = await fetch(`${API_URL}/items`);
    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }
    const data: ApiItem[] = await response.json();

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
