/**
 * Serviço de API para reviews
 * João Macarrão - Sistema de Avaliações
 */
import axios from 'axios';
import type { DishReview, DishReviewCreateData, DishReviewStats } from '../types/review';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const reviewService = {
  /**
   * Cria avaliação (requer auth)
   */
  async createReview(data: DishReviewCreateData): Promise<DishReview> {
    const response = await axios.post(
      `${API_URL}/reviews/`,
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Lista avaliações de um prato (público)
   */
  async getDishReviews(dishId: number, ordering?: string): Promise<DishReview[]> {
    const response = await axios.get(
      `${API_URL}/reviews/dish/${dishId}/`,
      { params: { ordering } }
    );
    return response.data;
  },

  /**
   * Estatísticas de um prato (público)
   */
  async getDishStats(dishId: number): Promise<DishReviewStats> {
    const response = await axios.get(`${API_URL}/reviews/dish/${dishId}/stats/`);
    return response.data;
  },

  /**
   * Marca review como útil (requer auth)
   */
  async markHelpful(reviewId: number): Promise<any> {
    const response = await axios.post(
      `${API_URL}/reviews/${reviewId}/mark_helpful/`,
      {},
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Minhas avaliações (requer auth)
   */
  async getMyReviews(): Promise<DishReview[]> {
    const response = await axios.get(
      `${API_URL}/reviews/my_reviews/`,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Atualiza avaliação (requer auth)
   */
  async updateReview(reviewId: number, data: { rating: number; comment?: string }): Promise<DishReview> {
    const response = await axios.patch(
      `${API_URL}/reviews/${reviewId}/`,
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * Deleta avaliação (requer auth)
   */
  async deleteReview(reviewId: number): Promise<void> {
    await axios.delete(
      `${API_URL}/reviews/${reviewId}/`,
      getAuthHeaders()
    );
  }
};

