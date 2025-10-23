/**
 * Componente de resumo do carrinho
 * João Macarrão - Sistema de Carrinho
 */
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useNavigate } from 'react-router-dom';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  className?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  showCheckoutButton = true,
  className = ''
}) => {
  const navigate = useNavigate();
  const { items, deliveryFee, subtotal, total, itemsCount } = useCartStore();

  const subtotalValue = subtotal();
  const totalValue = total();
  const count = itemsCount();

  if (items.length === 0) {
    return (
      <div className={`cart-summary empty ${className}`}>
        <div className="empty-cart">
          <ShoppingCart size={48} />
          <p>Seu carrinho está vazio</p>
          <button
            onClick={() => navigate('/menu')}
            className="btn-browse"
          >
            Ver Cardápio
          </button>
        </div>

        <style jsx>{`
          .cart-summary.empty {
            padding: 2rem;
            text-align: center;
          }

          .empty-cart {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            color: #666;
          }

          .empty-cart svg {
            color: #ccc;
          }

          .btn-browse {
            padding: 0.75rem 1.5rem;
            background: #ff6b35;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }

          .btn-browse:hover {
            background: #e55a2b;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`cart-summary ${className}`}>
      <h3 className="summary-title">Resumo do Pedido</h3>

      <div className="summary-row">
        <span>Itens ({count})</span>
        <span>R$ {subtotalValue.toFixed(2)}</span>
      </div>

      <div className="summary-row">
        <span>Taxa de Entrega</span>
        <span>R$ {deliveryFee.toFixed(2)}</span>
      </div>

      <div className="summary-divider" />

      <div className="summary-row total">
        <span>Total</span>
        <span>R$ {totalValue.toFixed(2)}</span>
      </div>

      {showCheckoutButton && (
        <button
          onClick={() => navigate('/checkout')}
          className="btn-checkout"
          aria-label="Ir para o checkout"
        >
          Finalizar Pedido
        </button>
      )}

      <style jsx>{`
        .cart-summary {
          padding: 1.5rem;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
        }

        .summary-title {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #333;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
          color: #555;
        }

        .summary-row.total {
          font-size: 1.25rem;
          font-weight: 700;
          color: #333;
        }

        .summary-divider {
          height: 1px;
          background: #e0e0e0;
          margin: 1rem 0;
        }

        .btn-checkout {
          width: 100%;
          padding: 1rem;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 1rem;
        }

        .btn-checkout:hover {
          background: #e55a2b;
        }

        .btn-checkout:active {
          transform: scale(0.98);
        }

        @media (max-width: 768px) {
          .cart-summary {
            position: sticky;
            bottom: 0;
            z-index: 10;
            border-radius: 16px 16px 0 0;
            box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
          }
        }
      `}</style>
    </div>
  );
};

