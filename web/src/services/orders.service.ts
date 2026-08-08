import { api } from "./api";
import { type Order } from "../types/orders.types";
import { type PaginatedResponse } from "../types/pagination.types";

export const ordersService = {
  /**
   * Obtém a lista de pedidos baseada no tipo (compras ou vendas).
   * @param type "buying" para Minhas Compras, "selling" para Minhas Vendas
   */
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

  /**
   * Atualiza o status de um pedido (aceitar ou rejeitar).
   * @param orderId ID do pedido
   * @param action Ação a ser tomada ("accept" ou "reject")
   */
  async updateOrderStatus(
    orderId: string,
    action: "accept" | "reject",
  ): Promise<Order> {
    const { data } = await api.put<Order>(`/orders/${orderId}`, { action });
    return data;
  },
};
