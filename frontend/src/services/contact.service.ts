/**
 * Serviço de API para contato
 * João Macarrão - Sistema de Contato
 */
import axios from 'axios';
import type { ContactMessage, ContactMessageCreateData, ContactMessageResponse } from '../types/contact';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const contactService = {
  /**
   * Envia mensagem de contato (público)
   */
  async sendMessage(data: ContactMessageCreateData): Promise<ContactMessageResponse> {
    const response = await axios.post(`${API_URL}/contact/`, data);
    return response.data;
  },

  /**
   * Lista mensagens (admin apenas)
   */
  async getMessages(): Promise<ContactMessage[]> {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${API_URL}/contact/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  /**
   * Ver estatísticas (admin apenas)
   */
  async getStats(): Promise<any> {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`${API_URL}/contact/stats/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};

