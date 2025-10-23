/**
 * Serviço de API para pagamentos
 * João Macarrão - Sistema de Pagamentos
 */
import axios from 'axios';
import type {
  Payment,
  PaymentCreateData,
  PaymentResponse,
  PaymentConfirmData
} from '../types/payment';

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

export const paymentService = {
  /**
   * Cria um novo pagamento
   */
  async createPayment(data: PaymentCreateData): Promise<PaymentResponse> {
    const response = await axios.post(
      `${API_URL}/payments/create/`,
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Confirma um pagamento
   */
  async confirmPayment(data: PaymentConfirmData): Promise<{ success: boolean; payment: Payment }> {
    const response = await axios.post(
      `${API_URL}/payments/confirm/`,
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Busca detalhes de um pagamento
   */
  async getPayment(paymentId: number): Promise<Payment> {
    const response = await axios.get(
      `${API_URL}/payments/payments/${paymentId}/`,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Verifica status de um pagamento
   */
  async checkPaymentStatus(paymentId: number): Promise<Payment> {
    const response = await axios.get(
      `${API_URL}/payments/payments/${paymentId}/status/`,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Lista histórico de pagamentos
   */
  async getPaymentHistory(status?: string): Promise<Payment[]> {
    const response = await axios.get(
      `${API_URL}/payments/history/`,
      {
        ...getAuthHeaders(),
        params: status ? { status } : undefined
      }
    );
    return response.data;
  }
};

