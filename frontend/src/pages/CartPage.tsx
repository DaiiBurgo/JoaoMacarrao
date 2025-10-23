/**
 * Página do Carrinho
 * João Macarrão - Sistema de Carrinho
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();

  const handleClearCart = () => {
    if (confirm('Deseja realmente limpar o carrinho?')) {
      clearCart();
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <header className="cart-header">
          <button
            onClick={() => navigate(-1)}
            className="btn-back"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>

          <h1 className="cart-title">
            <ShoppingCart size={28} />
            Carrinho
          </h1>

          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="btn-clear"
              aria-label="Limpar carrinho"
            >
              Limpar Carrinho
            </button>
          )}
        </header>

        {items.length === 0 ? (
          <div className="empty-state">
            <ShoppingCart size={64} />
            <h2>Seu carrinho está vazio</h2>
            <p>Adicione itens do cardápio para começar seu pedido</p>
            <button
              onClick={() => navigate('/menu')}
              className="btn-menu"
            >
              Ver Cardápio
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <h2 className="items-title">
                Itens do Pedido ({items.length})
              </h2>
              
              <div className="items-list">
                {items.map((item) => (
                  <CartItem key={item.dish.id} item={item} />
                ))}
              </div>
            </div>

            <aside className="cart-sidebar">
              <CartSummary showCheckoutButton={true} />
              
              <div className="info-box">
                <h4>💡 Dica</h4>
                <p>
                  Você pode adicionar observações especiais para cada prato
                  (ex: sem cebola, bem passado, etc.)
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-page {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 2rem 1rem;
        }

        .cart-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e0e0e0;
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 0.95rem;
          color: #555;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-back:hover {
          background: #f5f5f5;
          border-color: #ccc;
        }

        .cart-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #333;
        }

        .btn-clear {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #ff6b35;
          border-radius: 8px;
          color: #ff6b35;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-clear:hover {
          background: #ff6b35;
          color: white;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .empty-state svg {
          color: #ccc;
          margin-bottom: 1.5rem;
        }

        .empty-state h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          color: #333;
        }

        .empty-state p {
          margin: 0 0 2rem 0;
          color: #666;
        }

        .btn-menu {
          padding: 0.75rem 2rem;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-menu:hover {
          background: #e55a2b;
        }

        .cart-content {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2rem;
          align-items: start;
        }

        .cart-items {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .items-title {
          margin: 0 0 1.5rem 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-sidebar {
          position: sticky;
          top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-box {
          padding: 1rem;
          background: #fff8dc;
          border: 1px solid #ffd700;
          border-radius: 8px;
        }

        .info-box h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          color: #333;
        }

        .info-box p {
          margin: 0;
          font-size: 0.875rem;
          color: #555;
          line-height: 1.4;
        }

        @media (max-width: 1024px) {
          .cart-content {
            grid-template-columns: 1fr;
          }

          .cart-sidebar {
            position: static;
          }
        }

        @media (max-width: 640px) {
          .cart-page {
            padding: 1rem 0.5rem;
          }

          .cart-header {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .cart-title {
            font-size: 1.5rem;
            width: 100%;
            order: -1;
          }

          .btn-back,
          .btn-clear {
            font-size: 0.85rem;
            padding: 0.4rem 0.8rem;
          }

          .cart-items {
            padding: 1rem;
          }

          .items-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;

