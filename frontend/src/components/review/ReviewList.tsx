/**
 * Lista de avaliações
 * João Macarrão - Sistema de Reviews
 */
import React, { useState, useEffect } from 'react';
import { ThumbsUp, User } from 'lucide-react';
import { ReviewStars } from './ReviewStars';
import { reviewService } from '../../services/review.service';
import type { DishReview } from '../../types/review';

interface ReviewListProps {
  dishId: number;
  refreshTrigger?: number;
}

export const ReviewList: React.FC<ReviewListProps> = ({ dishId, refreshTrigger }) => {
  const [reviews, setReviews] = useState<DishReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState('-created_at');

  useEffect(() => {
    loadReviews();
  }, [dishId, ordering, refreshTrigger]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getDishReviews(dishId, ordering);
      setReviews(data);
    } catch (err) {
      console.error('Erro ao carregar avaliações:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkHelpful = async (reviewId: number) => {
    try {
      await reviewService.markHelpful(reviewId);
      loadReviews();
    } catch (err) {
      console.error('Erro ao marcar como útil:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Carregando avaliações...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="no-reviews">
        <p>Ainda não há avaliações para este prato.</p>
        <p>Seja o primeiro a avaliar!</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      <div className="list-header">
        <h3>{reviews.length} Avaliações</h3>
        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="order-select"
        >
          <option value="-created_at">Mais Recentes</option>
          <option value="helpful">Mais Úteis</option>
          <option value="rating_high">Maior Avaliação</option>
          <option value="rating_low">Menor Avaliação</option>
        </select>
      </div>

      <div className="reviews-container">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="user-info">
                <div className="user-avatar">
                  <User size={24} />
                </div>
                <div>
                  <strong>{review.user_full_name || review.user_name}</strong>
                  <span className="review-date">{formatDate(review.created_at)}</span>
                </div>
              </div>
              <ReviewStars rating={review.rating} />
            </div>

            {review.comment && (
              <p className="review-comment">{review.comment}</p>
            )}

            <div className="review-footer">
              <button
                onClick={() => handleMarkHelpful(review.id)}
                className="btn-helpful"
                aria-label="Marcar como útil"
              >
                <ThumbsUp size={16} />
                <span>Útil ({review.helpful_count})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

