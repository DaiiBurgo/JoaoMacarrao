/**
 * Formulário de avaliação
 * João Macarrão - Sistema de Reviews
 */
import React, { useState } from 'react';
import { ReviewStars } from './ReviewStars';
import { reviewService } from '../../services/review.service';
import { Loader } from 'lucide-react';

interface ReviewFormProps {
  dishId: number;
  dishName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  dishId,
  dishName,
  onSuccess,
  onCancel
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Por favor, selecione uma avaliação');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await reviewService.createReview({
        dish: dishId,
        rating,
        comment: comment.trim() || undefined
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h3>Avaliar {dishName}</h3>

      <div className="form-group">
        <label>Sua Avaliação *</label>
        <ReviewStars
          rating={rating}
          interactive={true}
          onChange={setRating}
          showLabel={true}
          size={32}
        />
      </div>

      <div className="form-group">
        <label htmlFor="comment">Comentário (opcional)</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Conte-nos sobre sua experiência..."
          rows={4}
          maxLength={500}
        />
        <span className="char-count">{comment.length}/500</span>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
        )}
        <button type="submit" disabled={loading || rating === 0} className="btn-submit">
          {loading ? (
            <>
              <Loader className="spinner" size={18} />
              Enviando...
            </>
          ) : (
            'Enviar Avaliação'
          )}
        </button>
      </div>
    </form>
  );
};

