/**
 * Página de Checkout
 * João Macarrão - Sistema de Checkout e Pagamento
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { CartItem } from '../components/cart/CartItem';
import { PaymentOptions } from '../components/payment/PaymentOptions';
import { PaymentGateway } from '../components/payment/PaymentGateway';
import { orderService } from '../services/order.service';
import { paymentService } from '../services/payment.service';
import type { PaymentMethodType, PaymentResponse } from '../types/payment';
import type { OrderCreateData } from '../types/order';

type CheckoutStep = 'delivery' | 'payment_method' | 'payment_process' | 'success' | 'error';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, total, clearCart } = useCartStore();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dados de entrega
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('São Paulo');
  const [deliveryZipCode, setDeliveryZipCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Pagamento
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  const subtotalValue = subtotal();
  const totalValue = total();

  // Validações
  const canProceedToPaymentMethod = deliveryAddress.trim().length > 0 && deliveryCity.trim().length > 0;
  const canProceedToPayment = selectedPaymentMethod !== null;

  const handleCreateOrder = async () => {
    if (!selectedPaymentMethod) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Criar pedido
      const orderData: OrderCreateData = {
        payment_method: selectedPaymentMethod === 'pix' ? 'pix' : 
                       selectedPaymentMethod === 'credit_card' ? 'credit' :
                       selectedPaymentMethod === 'debit_card' ? 'debit' : 'money',
        delivery_address: deliveryAddress,
        delivery_city: deliveryCity,
        delivery_zip_code: deliveryZipCode,
        delivery_fee: deliveryFee,
        notes: orderNotes,
        items: items.map(item => ({
          dish_id: item.dish.id,
          quantity: item.quantity,
          notes: item.notes || ''
        }))
      };

      const order = await orderService.createOrder(orderData);
      setOrderId(order.id);

      // 2. Criar pagamento
      const payment = await paymentService.createPayment({
        order_id: order.id,
        payment_method: selectedPaymentMethod
      });

      setPaymentData(payment);
      setCurrentStep('payment_process');

    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar pedido. Tente novamente.');
      setCurrentStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    setCurrentStep('success');
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setCurrentStep('error');
  };

  // Render vazio se carrinho estiver vazio
  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h2>Carrinho Vazio</h2>
          <p>Adicione itens ao carrinho para fazer um pedido.</p>
          <button onClick={() => navigate('/menu')} className="btn-menu">
            Ver Cardápio
          </button>
        </div>

        <style jsx>{`
          .checkout-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            padding: 2rem;
          }

          .empty-cart {
            text-align: center;
            background: white;
            padding: 3rem;
            border-radius: 16px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
          }

          .empty-cart h2 {
            margin: 0 0 1rem 0;
            color: #333;
          }

          .empty-cart p {
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
          }

          .btn-menu:hover {
            background: #e55a2b;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <header className="checkout-header">
          <button
            onClick={() => currentStep === 'delivery' ? navigate('/cart') : setCurrentStep('delivery')}
            className="btn-back"
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>

          <h1>Finalizar Pedido</h1>
        </header>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep === 'delivery' ? 'active' : currentStep !== 'delivery' ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span>Entrega</span>
          </div>
          <div className="step-line" />
          <div className={`step ${currentStep === 'payment_method' ? 'active' : ['payment_process', 'success'].includes(currentStep) ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span>Pagamento</span>
          </div>
          <div className="step-line" />
          <div className={`step ${currentStep === 'payment_process' ? 'active' : currentStep === 'success' ? 'completed' : ''}`}>
            <div className="step-number">3</div>
            <span>Confirmar</span>
          </div>
        </div>

        <div className="checkout-content">
          {/* Left: Forms / Payment */}
          <div className="checkout-main">
            {/* Step 1: Delivery Info */}
            {currentStep === 'delivery' && (
              <div className="step-content">
                <h2>Informações de Entrega</h2>
                
                <form className="delivery-form">
                  <div className="form-group">
                    <label htmlFor="address">Endereço Completo *</label>
                    <textarea
                      id="address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Rua, número, complemento..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">Cidade *</label>
                      <input
                        id="city"
                        type="text"
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="zipcode">CEP</label>
                      <input
                        id="zipcode"
                        type="text"
                        value={deliveryZipCode}
                        onChange={(e) => setDeliveryZipCode(e.target.value)}
                        placeholder="00000-000"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes">Observações do Pedido</label>
                    <textarea
                      id="notes"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Alguma observação especial?"
                      rows={2}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep('payment_method')}
                    disabled={!canProceedToPaymentMethod}
                    className="btn-next"
                  >
                    Continuar para Pagamento
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 'payment_method' && (
              <div className="step-content">
                <h2>Forma de Pagamento</h2>
                
                <PaymentOptions
                  selectedMethod={selectedPaymentMethod}
                  onSelectMethod={setSelectedPaymentMethod}
                />

                <div className="actions">
                  <button
                    onClick={() => setCurrentStep('delivery')}
                    className="btn-back-step"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleCreateOrder}
                    disabled={!canProceedToPayment || loading}
                    className="btn-next"
                  >
                    {loading ? (
                      <>
                        <Loader className="spinner" size={20} />
                        Processando...
                      </>
                    ) : (
                      'Confirmar e Pagar'
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Process */}
            {currentStep === 'payment_process' && paymentData && (
              <div className="step-content">
                <PaymentGateway
                  paymentData={paymentData}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            )}

            {/* Success */}
            {currentStep === 'success' && (
              <div className="step-content success">
                <CheckCircle size={64} className="success-icon" />
                <h2>Pedido Realizado com Sucesso!</h2>
                <p>Seu pedido #{orderId} foi confirmado e está sendo preparado.</p>
                <div className="success-actions">
                  <button onClick={() => navigate(`/orders/${orderId}`)} className="btn-view-order">
                    Ver Detalhes do Pedido
                  </button>
                  <button onClick={() => navigate('/menu')} className="btn-new-order">
                    Fazer Novo Pedido
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {currentStep === 'error' && (
              <div className="step-content error">
                <XCircle size={64} className="error-icon" />
                <h2>Erro ao Processar Pedido</h2>
                <p>{error || 'Ocorreu um erro inesperado. Tente novamente.'}</p>
                <button onClick={() => setCurrentStep('payment_method')} className="btn-retry">
                  Tentar Novamente
                </button>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <aside className="checkout-sidebar">
            <div className="order-summary">
              <h3>Resumo do Pedido</h3>
              
              <div className="summary-items">
                {items.map((item) => (
                  <CartItem key={item.dish.id} item={item} editable={false} />
                ))}
              </div>

              <div className="summary-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>R$ {subtotalValue.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Taxa de Entrega</span>
                  <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="total-divider" />
                <div className="total-row final">
                  <span>Total</span>
                  <span>R$ {totalValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .checkout-page {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 2rem 1rem;
        }

        .checkout-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .checkout-header {
          display: flex;
          align-items: center;
          gap: 1rem;
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
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-back:hover {
          background: #f5f5f5;
        }

        .checkout-header h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #333;
        }

        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 3rem;
          padding: 0 2rem;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #e0e0e0;
          border-radius: 50%;
          font-weight: 700;
          color: #666;
          transition: all 0.3s;
        }

        .step.active .step-number {
          background: #ff6b35;
          color: white;
        }

        .step.completed .step-number {
          background: #4caf50;
          color: white;
        }

        .step span {
          font-size: 0.875rem;
          font-weight: 600;
          color: #666;
        }

        .step.active span {
          color: #ff6b35;
        }

        .step-line {
          width: 80px;
          height: 2px;
          background: #e0e0e0;
          margin: 0 1rem;
        }

        .checkout-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2rem;
          align-items: start;
        }

        .checkout-main {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        }

        .step-content {
          padding: 2rem;
        }

        .step-content h2 {
          margin: 0 0 1.5rem 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
        }

        .delivery-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: #555;
        }

        .form-group input,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-family: inherit;
          font-size: 1rem;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #ff6b35;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .btn-next,
        .btn-back-step {
          padding: 1rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-next {
          width: 100%;
          background: #ff6b35;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-next:hover:not(:disabled) {
          background: #e55a2b;
        }

        .btn-next:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn-back-step {
          flex: 1;
          background: white;
          border: 1px solid #ddd;
          color: #555;
        }

        .btn-back-step:hover {
          background: #f5f5f5;
        }

        .step-content.success,
        .step-content.error {
          text-align: center;
          padding: 3rem 2rem;
        }

        .success-icon {
          color: #4caf50;
          margin-bottom: 1rem;
        }

        .error-icon {
          color: #f44336;
          margin-bottom: 1rem;
        }

        .step-content.success h2 {
          color: #4caf50;
        }

        .step-content.error h2 {
          color: #f44336;
        }

        .success-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn-view-order,
        .btn-new-order,
        .btn-retry {
          padding: 1rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-view-order {
          background: #ff6b35;
          color: white;
        }

        .btn-view-order:hover {
          background: #e55a2b;
        }

        .btn-new-order {
          background: white;
          border: 1px solid #ddd;
          color: #555;
        }

        .btn-new-order:hover {
          background: #f5f5f5;
        }

        .btn-retry {
          background: #ff6b35;
          color: white;
        }

        .btn-retry:hover {
          background: #e55a2b;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .checkout-sidebar {
          position: sticky;
          top: 2rem;
        }

        .order-summary {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        }

        .order-summary h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #333;
        }

        .summary-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .summary-totals {
          padding-top: 1rem;
          border-top: 2px solid #e0e0e0;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
          color: #555;
        }

        .total-divider {
          height: 1px;
          background: #e0e0e0;
          margin: 1rem 0;
        }

        .total-row.final {
          font-size: 1.25rem;
          font-weight: 700;
          color: #333;
        }

        @media (max-width: 1024px) {
          .checkout-content {
            grid-template-columns: 1fr;
          }

          .checkout-sidebar {
            position: static;
          }
        }

        @media (max-width: 640px) {
          .checkout-page {
            padding: 1rem 0.5rem;
          }

          .checkout-header h1 {
            font-size: 1.5rem;
          }

          .progress-steps {
            padding: 0 1rem;
          }

          .step span {
            font-size: 0.75rem;
          }

          .step-line {
            width: 40px;
          }

          .step-content {
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;

