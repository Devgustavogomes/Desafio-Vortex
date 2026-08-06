import { api } from "./api";
import { type Order } from "../types/orders.types";

export const ordersService = {
  /**
   * Obtém a lista de pedidos baseada no tipo (compras ou vendas).
   * @param type "buying" para Minhas Compras, "selling" para Minhas Vendas
   */
  async getOrders(type: "buying" | "selling"): Promise<Order[]> {
    const { data } = await api.get<Order[]>(`/orders?type=${type}`);
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
