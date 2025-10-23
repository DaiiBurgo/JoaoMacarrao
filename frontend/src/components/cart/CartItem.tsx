/**
 * Componente de item do carrinho
 * João Macarrão - Sistema de Carrinho
 */
import React from 'react';
import { Minus, Plus, Trash2, Edit } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types/order';
import { useCartStore } from '../../stores/cartStore';

interface CartItemProps {
  item: CartItemType;
  editable?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({ item, editable = true }) => {
  const { updateQuantity, removeItem, updateNotes } = useCartStore();
  const [isEditingNotes, setIsEditingNotes] = React.useState(false);
  const [notesValue, setNotesValue] = React.useState(item.notes || '');

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      if (confirm('Deseja remover este item do carrinho?')) {
        removeItem(item.dish.id);
      }
      return;
    }
    updateQuantity(item.dish.id, newQuantity);
  };

  const handleSaveNotes = () => {
    updateNotes(item.dish.id, notesValue);
    setIsEditingNotes(false);
  };

  const itemTotal = item.dish.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        {item.dish.image ? (
          <img src={item.dish.image} alt={item.dish.name} />
        ) : (
          <div className="cart-item-placeholder">🍝</div>
        )}
      </div>

      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.dish.name}</h3>
        <p className="cart-item-description">{item.dish.description}</p>
        
        {item.notes && !isEditingNotes && (
          <p className="cart-item-notes">
            <strong>Observações:</strong> {item.notes}
          </p>
        )}

        {isEditingNotes && (
          <div className="cart-item-notes-edit">
            <textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              placeholder="Observações do pedido..."
              rows={2}
              aria-label="Observações do item"
            />
            <div className="notes-actions">
              <button
                onClick={handleSaveNotes}
                className="btn-save"
                aria-label="Salvar observações"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setNotesValue(item.notes || '');
                  setIsEditingNotes(false);
                }}
                className="btn-cancel"
                aria-label="Cancelar edição"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {editable && !isEditingNotes && (
          <button
            onClick={() => setIsEditingNotes(true)}
            className="btn-edit-notes"
            aria-label="Editar observações"
          >
            <Edit size={14} />
            <span>Adicionar observações</span>
          </button>
        )}
      </div>

      <div className="cart-item-actions">
        <p className="cart-item-price">
          R$ {item.dish.price.toFixed(2)}
        </p>

        {editable && (
          <div className="cart-item-quantity">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="btn-quantity"
              aria-label="Diminuir quantidade"
            >
              <Minus size={16} />
            </button>
            <span className="quantity-value" aria-label={`Quantidade: ${item.quantity}`}>
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="btn-quantity"
              aria-label="Aumentar quantidade"
            >
              <Plus size={16} />
            </button>
          </div>
        )}

        {!editable && (
          <p className="quantity-display">
            Quantidade: {item.quantity}
          </p>
        )}

        <p className="cart-item-total">
          <strong>R$ {itemTotal.toFixed(2)}</strong>
        </p>

        {editable && (
          <button
            onClick={() => removeItem(item.dish.id)}
            className="btn-remove"
            aria-label="Remover item do carrinho"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <style jsx>{`
        .cart-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          background: #fff;
          transition: box-shadow 0.2s;
        }

        .cart-item:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .cart-item-image {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
        }

        .cart-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cart-item-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          font-size: 2rem;
        }

        .cart-item-details {
          flex: 1;
        }

        .cart-item-name {
          margin: 0 0 0.25rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }

        .cart-item-description {
          margin: 0 0 0.5rem 0;
          font-size: 0.875rem;
          color: #666;
        }

        .cart-item-notes {
          margin: 0.5rem 0 0 0;
          padding: 0.5rem;
          background: #f9f9f9;
          border-left: 3px solid #ff6b35;
          font-size: 0.875rem;
          color: #555;
        }

        .cart-item-notes-edit textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          resize: vertical;
        }

        .notes-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .btn-save,
        .btn-cancel {
          padding: 0.25rem 0.75rem;
          border: none;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-save {
          background: #ff6b35;
          color: white;
        }

        .btn-save:hover {
          background: #e55a2b;
        }

        .btn-cancel {
          background: #ddd;
          color: #333;
        }

        .btn-cancel:hover {
          background: #ccc;
        }

        .btn-edit-notes {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0;
          background: none;
          border: none;
          color: #ff6b35;
          font-size: 0.875rem;
          cursor: pointer;
          text-decoration: underline;
        }

        .btn-edit-notes:hover {
          color: #e55a2b;
        }

        .cart-item-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .cart-item-price {
          margin: 0;
          font-size: 0.875rem;
          color: #666;
        }

        .cart-item-quantity {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 0.25rem;
        }

        .btn-quantity {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: #f5f5f5;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-quantity:hover {
          background: #e0e0e0;
        }

        .btn-quantity:active {
          background: #d0d0d0;
        }

        .quantity-value {
          min-width: 30px;
          text-align: center;
          font-weight: 600;
        }

        .quantity-display {
          font-size: 0.875rem;
          color: #666;
        }

        .cart-item-total {
          margin: 0;
          font-size: 1.1rem;
          color: #333;
        }

        .btn-remove {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: #fff;
          border: 1px solid #ff6b35;
          border-radius: 4px;
          color: #ff6b35;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-remove:hover {
          background: #ff6b35;
          color: white;
        }

        @media (max-width: 640px) {
          .cart-item {
            flex-direction: column;
          }

          .cart-item-image {
            width: 100%;
            height: 150px;
          }

          .cart-item-actions {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

