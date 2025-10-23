/**
 * Página de Detalhes do Prato
 * João Macarrão - Com Reviews Integrados
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { ReviewStars } from '../components/review/ReviewStars';
import { ReviewForm } from '../components/review/ReviewForm';
import { ReviewList } from '../components/review/ReviewList';
import { useCartStore } from '../stores/cartStore';
import type { Dish } from '../types/order';

export const DishDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const [dish, setDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    loadDish();
  }, [id]);

  const loadDish = async () => {
    // Implementar chamada à API para buscar prato
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (dish) {
      addItem(dish, quantity);
      alert('Prato adicionado ao carrinho!');
    }
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setRefreshReviews(prev => prev + 1);
    alert('Avaliação enviada com sucesso!');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!dish) {
    return <div className="error">Prato não encontrado</div>;
  }

  return (
    <div className="dish-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={20} />
          Voltar
        </button>

        <div className="dish-content">
          <div className="dish-image-section">
            {dish.image && <img src={dish.image} alt={dish.name} />}
          </div>

          <div className="dish-info-section">
            <h1>{dish.name}</h1>
            
            <div className="dish-rating">
              <ReviewStars rating={4.5} />
              <span className="rating-text">4.5 (12 avaliações)</span>
            </div>

            <p className="dish-description">{dish.description}</p>

            <div className="dish-price">
              <span className="price-label">Preço:</span>
              <span className="price-value">R$ {dish.price.toFixed(2)}</span>
            </div>

            <div className="quantity-selector">
              <label>Quantidade:</label>
              <div className="quantity-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <button onClick={handleAddToCart} className="btn-add-to-cart">
              <ShoppingCart size={20} />
              Adicionar ao Carrinho
            </button>
          </div>
        </div>

        {/* Seção de Avaliações */}
        <div className="reviews-section">
          <div className="reviews-header">
            <h2><Star size={24} /> Avaliações</h2>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-write-review"
            >
              {showReviewForm ? 'Cancelar' : 'Escrever Avaliação'}
            </button>
          </div>

          {showReviewForm && id && (
            <div className="review-form-container">
              <ReviewForm
                dishId={parseInt(id)}
                dishName={dish.name}
                onSuccess={handleReviewSuccess}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          {id && (
            <ReviewList 
              dishId={parseInt(id)} 
              refreshTrigger={refreshReviews}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DishDetailPage;

