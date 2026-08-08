import { api } from "./api";
import { type Order } from "../types/orders.types";
import { type PaginatedResponse } from "../types/pagination.types";

export const ordersService = {
  
  async getOrders(
    type: "buying" | "selling",
    page: number = 1,
    limit: number = 12,
  ): Promise<PaginatedResponse<Order>> {
    const { data } = await api.get<PaginatedResponse<Order>>("/orders", {
      params: { type, page: String(page), limit: String(limit) },
    });
    return data;
  },

  
  async updateOrderStatus(
    orderId: string,
    action: "accept" | "reject",
  ): Promise<Order> {
    const { data } = await api.put<Order>(`/orders/${orderId}`, { action });
    return data;
  },
};
