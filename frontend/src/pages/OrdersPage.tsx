/**
 * Página de Histórico de Pedidos
 * João Macarrão - Sistema de Pedidos
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Loader, ChevronRight } from 'lucide-react';
import { orderService } from '../services/order.service';
import type { Order } from '../types/order';
import { OrderStatusDisplay, OrderStatusIcon, PaymentStatusDisplay } from '../types/order';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await orderService.getMyOrders(params);
      setOrders(response.results || response as any);
    } catch (err: any) {
      setError('Erro ao carregar pedidos. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Deseja realmente cancelar este pedido?')) {
      return;
    }

    try {
      await orderService.cancelOrder(orderId);
      loadOrders();
    } catch (err: any) {
      alert('Erro ao cancelar pedido: ' + (err.response?.data?.error || 'Erro desconhecido'));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        <header className="orders-header">
          <h1>
            <Package size={32} />
            Meus Pedidos
          </h1>
        </header>

        {/* Filters */}
        <div className="filters">
          <button
            onClick={() => setFilter('all')}
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
          >
            Confirmados
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
          >
            Entregues
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
          >
            Cancelados
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading-state">
            <Loader className="spinner" size={48} />
            <p>Carregando pedidos...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="error-state">
            <XCircle size={48} />
            <p>{error}</p>
            <button onClick={loadOrders} className="btn-retry">
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="empty-state">
            <Package size={64} />
            <h2>Nenhum pedido encontrado</h2>
            <p>Você ainda não fez nenhum pedido.</p>
            <button onClick={() => navigate('/menu')} className="btn-menu">
              Ver Cardápio
            </button>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Pedido #{order.id}</h3>
                    <p className="order-date">{formatDate(order.created_at)}</p>
                  </div>

                  <div className="order-status">
                    <span className={`status-badge status-${order.status}`}>
                      {OrderStatusIcon[order.status]} {OrderStatusDisplay[order.status]}
                    </span>
                  </div>
                </div>

                <div className="order-body">
                  <div className="order-items">
                    <h4>Itens ({order.items_count || order.items.length})</h4>
                    <ul>
                      {order.items.slice(0, 3).map((item) => (
                        <li key={item.id}>
                          {item.quantity}x {item.dish_name}
                        </li>
                      ))}
                      {order.items.length > 3 && (
                        <li className="more-items">
                          +{order.items.length - 3} item(s)
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="order-details">
                    <div className="detail-row">
                      <span>Subtotal:</span>
                      <span>R$ {order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Entrega:</span>
                      <span>R$ {order.delivery_fee.toFixed(2)}</span>
                    </div>
                    <div className="detail-row total">
                      <span>Total:</span>
                      <span>R$ {order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="order-payment">
                    <span className={`payment-status status-${order.payment_status}`}>
                      {PaymentStatusDisplay[order.payment_status]}
                    </span>
                    <span className="payment-method">
                      {order.payment_method_display}
                    </span>
                  </div>
                </div>

                <div className="order-footer">
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="btn-details"
                  >
                    Ver Detalhes
                    <ChevronRight size={18} />
                  </button>

                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="btn-cancel"
                    >
                      Cancelar Pedido
                    </button>
                  )}

                  {order.status === 'delivered' && (
                    <button
                      onClick={() => navigate('/menu')}
                      className="btn-reorder"
                    >
                      Pedir Novamente
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .orders-page {
          min-height: 100vh;
          background: #f8f9fa;
          padding: 2rem 1rem;
        }

        .orders-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .orders-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e0e0e0;
        }

        .orders-header h1 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #333;
        }

        .filters {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .filter-btn:hover {
          border-color: #ff6b35;
        }

        .filter-btn.active {
          background: #ff6b35;
          color: white;
          border-color: #ff6b35;
        }

        .loading-state,
        .error-state,
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

        .loading-state svg {
          color: #ff6b35;
          margin-bottom: 1rem;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .error-state svg {
          color: #f44336;
          margin-bottom: 1rem;
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

        .btn-retry,
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

        .btn-retry:hover,
        .btn-menu:hover {
          background: #e55a2b;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .order-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: box-shadow 0.2s;
        }

        .order-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.5rem;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
        }

        .order-info h3 {
          margin: 0 0 0.25rem 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #333;
        }

        .order-date {
          margin: 0;
          font-size: 0.875rem;
          color: #666;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .status-badge.status-pending {
          background: #fff3e0;
          color: #e65100;
        }

        .status-badge.status-confirmed {
          background: #e3f2fd;
          color: #1565c0;
        }

        .status-badge.status-preparing {
          background: #fce4ec;
          color: #c2185b;
        }

        .status-badge.status-ready {
          background: #f3e5f5;
          color: #7b1fa2;
        }

        .status-badge.status-delivering {
          background: #e1f5fe;
          color: #0277bd;
        }

        .status-badge.status-delivered {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .status-badge.status-cancelled {
          background: #ffebee;
          color: #c62828;
        }

        .order-body {
          padding: 1.5rem;
        }

        .order-items h4 {
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
          font-weight: 600;
          color: #555;
        }

        .order-items ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .order-items li {
          padding: 0.25rem 0;
          color: #666;
        }

        .more-items {
          color: #ff6b35;
          font-weight: 600;
        }

        .order-details {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e0e0e0;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }

        .detail-row.total {
          font-size: 1.1rem;
          font-weight: 700;
          color: #333;
          padding-top: 0.5rem;
          border-top: 1px solid #e0e0e0;
        }

        .order-payment {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e0e0e0;
        }

        .payment-status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .payment-status.status-pending {
          background: #fff3e0;
          color: #e65100;
        }

        .payment-status.status-processing {
          background: #e3f2fd;
          color: #1565c0;
        }

        .payment-status.status-paid {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .payment-status.status-failed {
          background: #ffebee;
          color: #c62828;
        }

        .payment-method {
          padding: 0.25rem 0.75rem;
          background: #f5f5f5;
          border-radius: 12px;
          font-size: 0.8rem;
          color: #555;
        }

        .order-footer {
          display: flex;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          border-top: 1px solid #e0e0e0;
        }

        .btn-details,
        .btn-cancel,
        .btn-reorder {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-details {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          background: #ff6b35;
          color: white;
        }

        .btn-details:hover {
          background: #e55a2b;
        }

        .btn-cancel {
          background: white;
          border: 1px solid #f44336;
          color: #f44336;
        }

        .btn-cancel:hover {
          background: #f44336;
          color: white;
        }

        .btn-reorder {
          background: white;
          border: 1px solid #ff6b35;
          color: #ff6b35;
        }

        .btn-reorder:hover {
          background: #ff6b35;
          color: white;
        }

        @media (max-width: 640px) {
          .orders-page {
            padding: 1rem 0.5rem;
          }

          .orders-header h1 {
            font-size: 1.5rem;
          }

          .order-header {
            flex-direction: column;
            gap: 1rem;
          }

          .order-footer {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default OrdersPage;

