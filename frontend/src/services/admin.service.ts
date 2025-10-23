/**
 * Serviço de API para painel administrativo
 * João Macarrão - Admin Dashboard
 */
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export interface AdminStats {
  orders: {
    total: number;
    today: number;
    week: number;
    pending: number;
    in_progress: number;
  };
  sales: {
    total: number;
    count: number;
    average: number;
    today: number;
    week: number;
    month: number;
  };
  users: {
    total: number;
    clients: number;
    staff: number;
    new_week: number;
  };
  dishes: {
    total: number;
    available: number;
    out_of_stock: number;
    top_rated: Array<{
      id: number;
      name: string;
      average_rating: string;
      reviews_count: number;
    }>;
  };
  messages: {
    total: number;
    pending: number;
    replied: number;
    new_today: number;
  };
  reviews: {
    total: number;
    pending: number;
    average: number;
    new_week: number;
  };
  charts: {
    orders_by_day: Array<{ date: string; count: number }>;
    sales_by_day: Array<{ date: string; total: number }>;
  };
}

export const adminService = {
  /**
   * Busca estatísticas completas (admin apenas)
   */
  async getStats(): Promise<AdminStats> {
    const response = await axios.get(
      `${API_URL}/admin/stats/`,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Busca resumo do dashboard (admin apenas)
   */
  async getDashboard(): Promise<any> {
    const response = await axios.get(
      `${API_URL}/admin/dashboard/`,
      getAuthHeaders()
    );
    return response.data;
  }
};

