/**
 * Componente de gateway de pagamento
 * João Macarrão - Sistema de Pagamentos
 */
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'react-qrcode-logo';
import { Copy, CheckCircle, XCircle, Loader } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { PaymentResponse, PixPaymentResponse, StripePaymentResponse } from '../../types/payment';

// Só carrega o Stripe se houver uma chave válida
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey && stripeKey.length > 0 ? loadStripe(stripeKey) : null;

interface PaymentGatewayProps {
  paymentData: PaymentResponse;
  onSuccess: () => void;
  onError: (error: string) => void;
}

// Componente de pagamento PIX
const PixPayment: React.FC<{
  data: PixPaymentResponse;
  onSuccess: () => void;
}> = ({ data, onSuccess }) => {
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.copy_paste);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  // Simulação de verificação de pagamento
  const checkPayment = () => {
    setChecking(true);
    // Em produção, você faria polling no backend
    setTimeout(() => {
      setChecking(false);
      // Simula confirmação após 5 segundos
      if (Math.random() > 0.5) {
        onSuccess();
      }
    }, 2000);
  };

  return (
    <div className="pix-payment">
      <h3>Pagar com PIX</h3>
      
      <div className="qr-code-container">
        <div className="qr-code">
          {data.qr_code.startsWith('data:') ? (
            <img src={data.qr_code} alt="QR Code PIX" />
          ) : (
            <QRCodeSVG
              value={data.copy_paste}
              size={200}
              level="H"
              includeMargin={true}
            />
          )}
        </div>
      </div>

      <div className="pix-instructions">
        <h4>Como pagar:</h4>
        <ol>
          <li>Abra o app do seu banco</li>
          <li>Escolha Pagar com PIX</li>
          <li>Escaneie o QR Code ou copie o código</li>
          <li>Confirme o pagamento</li>
        </ol>
      </div>

      <div className="copy-paste-section">
        <p className="copy-label">Ou copie o código:</p>
        <div className="copy-container">
          <input
            type="text"
            value={data.copy_paste}
            readOnly
            className="copy-input"
            aria-label="Código PIX"
          />
          <button
            onClick={handleCopy}
            className="btn-copy"
            aria-label={copied ? 'Código copiado' : 'Copiar código'}
          >
            {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>
      </div>

      <div className="payment-value">
        <strong>Valor:</strong> R$ {data.amount.toFixed(2)}
      </div>

      <button
        onClick={checkPayment}
        className="btn-check-payment"
        disabled={checking}
      >
        {checking ? (
          <>
            <Loader className="spinner" size={20} />
            Verificando pagamento...
          </>
        ) : (
          'Já paguei'
        )}
      </button>

      <p className="payment-note">
        ⏰ Este QR Code expira em 30 minutos
      </p>

      <style jsx>{`
        .pix-payment {
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        }

        .pix-payment h3 {
          margin: 0 0 1.5rem 0;
          text-align: center;
          font-size: 1.5rem;
          color: #333;
        }

        .qr-code-container {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .qr-code {
          padding: 1rem;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
        }

        .qr-code img,
        .qr-code svg {
          display: block;
          max-width: 200px;
          height: auto;
        }

        .pix-instructions {
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .pix-instructions h4 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          color: #333;
        }

        .pix-instructions ol {
          margin: 0;
          padding-left: 1.5rem;
          color: #555;
          line-height: 1.8;
        }

        .copy-paste-section {
          margin-bottom: 1.5rem;
        }

        .copy-label {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: #555;
        }

        .copy-container {
          display: flex;
          gap: 0.5rem;
        }

        .copy-input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-family: monospace;
          font-size: 0.85rem;
          background: #f8f9fa;
        }

        .btn-copy {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .btn-copy:hover {
          background: #e55a2b;
        }

        .payment-value {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #fff8dc;
          border: 2px solid #ffd700;
          border-radius: 8px;
          text-align: center;
          font-size: 1.25rem;
          color: #333;
        }

        .btn-check-payment {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-check-payment:hover:not(:disabled) {
          background: #45a049;
        }

        .btn-check-payment:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .payment-note {
          margin: 1rem 0 0 0;
          text-align: center;
          font-size: 0.875rem;
          color: #666;
        }
      `}</style>
    </div>
  );
};

// Componente de formulário de cartão Stripe
const StripeCardForm: React.FC<{
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}> = ({ clientSecret, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement
        }
      });

      if (error) {
        onError(error.message || 'Erro ao processar pagamento');
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      }
    } catch (err: any) {
      onError(err.message || 'Erro ao processar pagamento');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <h3>Pagar com Cartão</h3>
      
      <div className="card-element-container">
        <label htmlFor="card-element">Dados do Cartão</label>
        <CardElement
          id="card-element"
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#32325d',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                '::placeholder': {
                  color: '#aab7c4'
                }
              },
              invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
              }
            }
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn-pay"
      >
        {processing ? (
          <>
            <Loader className="spinner" size={20} />
            Processando...
          </>
        ) : (
          'Pagar Agora'
        )}
      </button>

      <p className="secure-note">
        🔒 Pagamento seguro processado pelo Stripe
      </p>

      <style jsx>{`
        .stripe-form {
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        }

        .stripe-form h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.5rem;
          color: #333;
        }

        .card-element-container {
          margin-bottom: 1.5rem;
        }

        .card-element-container label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #555;
        }

        .card-element-container :global(.StripeElement) {
          padding: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
        }

        .card-element-container :global(.StripeElement--focus) {
          border-color: #ff6b35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .btn-pay {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-pay:hover:not(:disabled) {
          background: #e55a2b;
        }

        .btn-pay:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .secure-note {
          margin: 1rem 0 0 0;
          text-align: center;
          font-size: 0.875rem;
          color: #666;
        }
      `}</style>
    </form>
  );
};

// Componente principal
export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  paymentData,
  onSuccess,
  onError
}) => {
  // PIX
  if (paymentData.payment_method === 'pix') {
    return (
      <PixPayment
        data={paymentData.data as PixPaymentResponse}
        onSuccess={onSuccess}
      />
    );
  }

  // Cartão (Stripe)
  if (paymentData.payment_method === 'credit_card' || paymentData.payment_method === 'debit_card') {
    const stripeData = paymentData.data as StripePaymentResponse;
    
    // Se o Stripe não estiver configurado
    if (!stripePromise) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px' }}>
          <p style={{ color: '#e63946', marginBottom: '1rem' }}>⚠️ Pagamento com cartão não disponível</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Configure a chave do Stripe para habilitar pagamentos com cartão.</p>
        </div>
      );
    }
    
    return (
      <Elements stripe={stripePromise}>
        <StripeCardForm
          clientSecret={stripeData.client_secret}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
    );
  }

  // Dinheiro
  if (paymentData.payment_method === 'cash') {
    return (
      <div className="cash-payment">
        <h3>Pagamento em Dinheiro</h3>
        <p className="cash-message">
          O pagamento será realizado no momento da entrega.
          Por favor, tenha o valor exato se possível.
        </p>
        <button onClick={onSuccess} className="btn-confirm">
          Confirmar Pedido
        </button>

        <style jsx>{`
          .cash-payment {
            padding: 2rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
          }

          .cash-payment h3 {
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
            color: #333;
          }

          .cash-message {
            margin: 0 0 2rem 0;
            font-size: 1rem;
            color: #555;
            line-height: 1.6;
          }

          .btn-confirm {
            padding: 1rem 2rem;
            background: #ff6b35;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }

          .btn-confirm:hover {
            background: #e55a2b;
          }
        `}</style>
      </div>
    );
  }

  return null;
};

