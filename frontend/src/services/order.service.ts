/**
 * Serviço de API para pedidos
 * João Macarrão - Sistema de Pedidos
 */
import axios from 'axios';
import type { Order, OrderCreateData } from '../types/order';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Função auxiliar para obter token
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const orderService = {
  /**
   * Cria um novo pedido
   */
  async createOrder(data: OrderCreateData): Promise<Order> {
    const response = await axios.post(
      `${API_URL}/orders/`,
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Lista todos os pedidos do usuário
   */
  async getMyOrders(params?: {
    status?: string;
    ordering?: string;
    page?: number;
  }): Promise<{ results: Order[]; count: number; next: string | null; previous: string | null }> {
    const response = await axios.get(
      `${API_URL}/orders/my_orders/`,
      {
        ...getAuthHeaders(),
        params
      }
    );
    return response.data;
  },

  /**
   * Busca detalhes de um pedido específico
   */
  async getOrder(orderId: number): Promise<Order> {
    const response = await axios.get(
      `${API_URL}/orders/${orderId}/`,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Atualiza status de um pedido (apenas atendentes/admins)
   */
  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const response = await axios.patch(
      `${API_URL}/orders/${orderId}/update_status/`,
      { status },
      getAuthHeaders()
    );
    return response.data.order;
  },

  /**
   * Cancela um pedido
   */
  async cancelOrder(orderId: number): Promise<Order> {
    const response = await axios.post(
      `${API_URL}/orders/${orderId}/cancel/`,
      {},
      getAuthHeaders()
    );
    return response.data.order;
  },

  /**
   * Lista pedidos pendentes (apenas atendentes/admins)
   */
  async getPendingOrders(): Promise<Order[]> {
    const response = await axios.get(
      `${API_URL}/orders/pending/`,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Lista pedidos em andamento (apenas atendentes/admins)
   */
  async getInProgressOrders(): Promise<Order[]> {
    const response = await axios.get(
      `${API_URL}/orders/in_progress/`,
      getAuthHeaders()
    );
    return response.data;
  }
};

