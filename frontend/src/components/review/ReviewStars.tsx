/**
 * Componente de estrelas de avaliação
 * João Macarrão - Sistema de Reviews
 */
import React from 'react';
import { Star } from 'lucide-react';

interface ReviewStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showLabel?: boolean;
}

const labels: Record<number, string> = {
  1: 'Muito Ruim',
  2: 'Ruim',
  3: 'Regular',
  4: 'Bom',
  5: 'Excelente'
};

export const ReviewStars: React.FC<ReviewStarsProps> = ({
  rating,
  maxRating = 5,
  size = 20,
  interactive = false,
  onChange,
  showLabel = false
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);
  const displayRating = hoverRating || rating;

  return (
    <div className="review-stars">
      <div className="stars-container">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;

          return (
            <button
              key={index}
              type="button"
              className={`star ${isFilled ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
              onClick={() => interactive && onChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              disabled={!interactive}
              aria-label={`${starValue} estrelas`}
            >
              <Star
                size={size}
                fill={isFilled ? '#fbbf24' : 'none'}
                color={isFilled ? '#fbbf24' : '#d1d5db'}
              />
            </button>
          );
        })}
      </div>
      {showLabel && interactive && hoverRating > 0 && (
        <span className="rating-label">{labels[hoverRating]}</span>
      )}
    </div>
  );
};

