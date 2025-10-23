/**
 * Tipos TypeScript para sistema de avaliações
 * João Macarrão - Sistema de Reviews
 */

export interface DishReview {
  id: number;
  dish: number;
  dish_name?: string;
  user: number;
  user_name?: string;
  user_full_name?: string;
  rating: number;
  comment?: string;
  is_approved: boolean;
  helpful_count: number;
  is_editable?: boolean;
  created_at: string;
  updated_at: string;
}

export interface DishReviewCreateData {
  dish: number;
  rating: number;
  comment?: string;
}

export interface DishReviewStats {
  dish_id: number;
  dish_name: string;
  average_rating: number;
  total_reviews: number;
  distribution: {
    stars_1: number;
    stars_2: number;
    stars_3: number;
    stars_4: number;
    stars_5: number;
  };
}

export const RatingLabels: Record<number, string> = {
  1: 'Muito Ruim',
  2: 'Ruim',
  3: 'Regular',
  4: 'Bom',
  5: 'Excelente'
};

