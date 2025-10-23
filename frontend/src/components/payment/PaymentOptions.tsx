/**
 * Componente de seleção de método de pagamento
 * João Macarrão - Sistema de Pagamentos
 */
import React from 'react';
import { CreditCard, Smartphone, DollarSign } from 'lucide-react';
import type { PaymentMethodType } from '../../types/payment';
import { PaymentMethodNames, PaymentMethodIcons } from '../../types/payment';

interface PaymentOptionsProps {
  selectedMethod: PaymentMethodType | null;
  onSelectMethod: (method: PaymentMethodType) => void;
  disabled?: boolean;
}

const paymentMethods: { value: PaymentMethodType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'pix',
    label: 'PIX',
    icon: <Smartphone size={24} />,
    description: 'Pagamento instantâneo via QR Code'
  },
  {
    value: 'credit_card',
    label: 'Cartão de Crédito',
    icon: <CreditCard size={24} />,
    description: 'Pagamento seguro com cartão'
  },
  {
    value: 'debit_card',
    label: 'Cartão de Débito',
    icon: <CreditCard size={24} />,
    description: 'Pagamento com débito'
  },
  {
    value: 'cash',
    label: 'Dinheiro',
    icon: <DollarSign size={24} />,
    description: 'Pagamento na entrega'
  }
];

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  selectedMethod,
  onSelectMethod,
  disabled = false
}) => {
  return (
    <div className="payment-options">
      <h3 className="options-title">Forma de Pagamento</h3>
      
      <div className="options-grid" role="radiogroup" aria-label="Selecione a forma de pagamento">
        {paymentMethods.map((method) => (
          <button
            key={method.value}
            onClick={() => !disabled && onSelectMethod(method.value)}
            className={`payment-option ${selectedMethod === method.value ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
            disabled={disabled}
            role="radio"
            aria-checked={selectedMethod === method.value}
            aria-label={`${method.label}: ${method.description}`}
          >
            <div className="option-icon">
              {method.icon}
            </div>
            
            <div className="option-content">
              <h4 className="option-label">{method.label}</h4>
              <p className="option-description">{method.description}</p>
            </div>

            {selectedMethod === method.value && (
              <div className="option-check" aria-hidden="true">✓</div>
            )}
          </button>
        ))}
      </div>

      {selectedMethod === 'pix' && (
        <div className="payment-info pix" role="status">
          <p>
            <strong>PIX:</strong> Após confirmar, você receberá um QR Code
            para realizar o pagamento instantaneamente.
          </p>
        </div>
      )}

      {(selectedMethod === 'credit_card' || selectedMethod === 'debit_card') && (
        <div className="payment-info card" role="status">
          <p>
            <strong>Cartão:</strong> Você será redirecionado para uma página
            segura para inserir os dados do seu cartão.
          </p>
        </div>
      )}

      {selectedMethod === 'cash' && (
        <div className="payment-info cash" role="status">
          <p>
            <strong>Dinheiro:</strong> O pagamento será realizado no momento
            da entrega. Tenha o valor exato se possível.
          </p>
        </div>
      )}

      <style jsx>{`
        .payment-options {
          width: 100%;
        }

        .options-title {
          margin: 0 0 1.5rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #333;
        }

        .options-grid {
          display: grid;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .payment-option {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .payment-option:hover:not(.disabled) {
          border-color: #ff6b35;
          box-shadow: 0 2px 8px rgba(255, 107, 53, 0.1);
        }

        .payment-option.selected {
          border-color: #ff6b35;
          background: #fff5f0;
        }

        .payment-option.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .option-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: #f5f5f5;
          border-radius: 8px;
          color: #555;
        }

        .payment-option.selected .option-icon {
          background: #ff6b35;
          color: white;
        }

        .option-content {
          flex: 1;
        }

        .option-label {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #333;
        }

        .option-description {
          margin: 0;
          font-size: 0.875rem;
          color: #666;
        }

        .option-check {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: #ff6b35;
          color: white;
          border-radius: 50%;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .payment-info {
          padding: 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .payment-info p {
          margin: 0;
        }

        .payment-info.pix {
          background: #e8f5e9;
          border-left: 4px solid #4caf50;
          color: #2e7d32;
        }

        .payment-info.card {
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
          color: #1565c0;
        }

        .payment-info.cash {
          background: #fff3e0;
          border-left: 4px solid #ff9800;
          color: #e65100;
        }

        @media (max-width: 640px) {
          .payment-option {
            padding: 1rem;
            gap: 0.75rem;
          }

          .option-icon {
            width: 40px;
            height: 40px;
          }

          .option-label {
            font-size: 0.95rem;
          }

          .option-description {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

