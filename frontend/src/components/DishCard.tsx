import React, { useState } from 'react';
import { ShoppingCart, Volume2, Video, Star } from 'lucide-react';
import '../styles/dish-card.css';

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  prepTime?: string;
}

interface DishCardProps {
  dish: Dish;
  onAddToCart?: (dish: Dish) => void;
  onPlayAudio?: (text: string) => void;
  onPlayVideo?: (dishId: number) => void;
}

const DishCard: React.FC<DishCardProps> = ({
  dish,
  onAddToCart,
  onPlayAudio,
  onPlayVideo,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAddToCart = async () => {
    if (onAddToCart && !isAdding) {
      setIsAdding(true);
      await onAddToCart(dish);
      
      // Visual feedback
      setTimeout(() => {
        setIsAdding(false);
      }, 600);
    }
  };

  const handlePlayAudio = () => {
    if (onPlayAudio) {
      setIsPlayingAudio(true);
      const audioText = `${dish.name}. ${dish.description}. Preço: R$ ${dish.price.toFixed(2)}.`;
      onPlayAudio(audioText);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 3000);
    }
  };

  const handlePlayVideo = () => {
    if (onPlayVideo) {
      onPlayVideo(dish.id);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={index < rating ? 'star-filled' : 'star-empty'}
        fill={index < rating ? 'currentColor' : 'none'}
      />
    ));
  };

  return (
    <article className="dish-card" aria-label={`Prato: ${dish.name}`}>
      {/* Image */}
      <div className="dish-card-image-wrapper">
        {dish.image ? (
          <img
            src={dish.image}
            alt={`Foto do prato ${dish.name}`}
            className="dish-card-image"
            loading="lazy"
          />
        ) : (
          <div className="dish-card-image-placeholder">
            <span className="placeholder-icon">🍝</span>
          </div>
        )}
        
        {/* Category Badge */}
        {dish.category && (
          <span className="dish-category-badge" aria-label={`Categoria: ${dish.category}`}>
            {dish.category}
          </span>
        )}

        {/* Prep Time Badge */}
        {dish.prepTime && (
          <span className="dish-time-badge" aria-label={`Tempo de preparo: ${dish.prepTime}`}>
            ⏱️ {dish.prepTime}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="dish-card-body">
        {/* Header */}
        <div className="dish-card-header">
          <h3 className="dish-card-title">{dish.name}</h3>
          
          {/* Rating */}
          {dish.rating && dish.rating > 0 && (
            <div className="dish-rating" aria-label={`Avaliação: ${dish.rating} de 5 estrelas`}>
              <div className="stars">
                {renderStars(dish.rating)}
              </div>
              <span className="rating-value">{dish.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="dish-card-description">{dish.description}</p>

        {/* Price */}
        <div className="dish-card-price">
          <span className="price-label">Preço:</span>
          <span className="price-value">{formatPrice(dish.price)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="dish-card-actions">
        {/* Audio Button */}
        <button
          className={`btn-action btn-audio ${isPlayingAudio ? 'playing' : ''}`}
          onClick={handlePlayAudio}
          aria-label="Ouvir descrição do prato"
          title="Ouvir descrição"
          disabled={!onPlayAudio}
        >
          <Volume2 size={18} />
          <span>Ouvir</span>
        </button>

        {/* Video Button */}
        <button
          className="btn-action btn-video"
          onClick={handlePlayVideo}
          aria-label="Ver vídeo do preparo"
          title="Ver vídeo do preparo"
          disabled={!onPlayVideo}
        >
          <Video size={18} />
          <span>Vídeo</span>
        </button>

        {/* Add to Cart Button */}
        <button
          className={`btn-action btn-add-to-cart ${isAdding ? 'adding' : ''}`}
          onClick={handleAddToCart}
          aria-label={`Adicionar ${dish.name} ao carrinho`}
          title="Adicionar ao carrinho"
          disabled={!onAddToCart || isAdding}
        >
          <ShoppingCart size={18} />
          <span>{isAdding ? 'Adicionado!' : 'Adicionar'}</span>
        </button>
      </div>

      {/* Hover Effect Overlay */}
      <div className="dish-card-hover-overlay" aria-hidden="true"></div>
    </article>
  );
};

export default DishCard;

