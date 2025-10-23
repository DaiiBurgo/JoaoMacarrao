/**
 * Painel Administrativo
 * João Macarrão - Admin Dashboard
 */
import React, { useState, useEffect } from 'react';
import { 
  Package, DollarSign, Users, Star, 
  MessageSquare, TrendingUp, AlertCircle,
  ShoppingBag, CheckCircle, Clock
} from 'lucide-react';
import { adminService, type AdminStats } from '../services/admin.service';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (err: any) {
      setError('Erro ao carregar estatísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">Carregando dashboard...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="error-container">
        <AlertCircle size={48} />
        <p>{error || 'Erro ao carregar dados'}</p>
        <button onClick={loadStats}>Tentar Novamente</button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Painel Administrativo</h1>
        <p>Visão geral do João Macarrão</p>
      </header>

      {/* Alertas */}
      {(stats.orders.pending > 0 || stats.messages.pending > 0) && (
        <div className="alerts-section">
          <h3><AlertCircle size={20} /> Atenção Necessária</h3>
          <div className="alerts-grid">
            {stats.orders.pending > 0 && (
              <div className="alert-card">
                <Clock size={24} />
                <div>
                  <strong>{stats.orders.pending}</strong>
                  <span>Pedidos Pendentes</span>
                </div>
              </div>
            )}
            {stats.messages.pending > 0 && (
              <div className="alert-card">
                <MessageSquare size={24} />
                <div>
                  <strong>{stats.messages.pending}</strong>
                  <span>Mensagens Pendentes</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon orders">
            <ShoppingBag size={28} />
          </div>
          <div className="stat-content">
            <h3>Pedidos</h3>
            <p className="stat-value">{stats.orders.total}</p>
            <p className="stat-detail">Hoje: {stats.orders.today} | Semana: {stats.orders.week}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon sales">
            <DollarSign size={28} />
          </div>
          <div className="stat-content">
            <h3>Vendas</h3>
            <p className="stat-value">R$ {stats.sales.total.toFixed(2)}</p>
            <p className="stat-detail">Média: R$ {stats.sales.average.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users">
            <Users size={28} />
          </div>
          <div className="stat-content">
            <h3>Usuários</h3>
            <p className="stat-value">{stats.users.total}</p>
            <p className="stat-detail">Clientes: {stats.users.clients} | Staff: {stats.users.staff}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon reviews">
            <Star size={28} />
          </div>
          <div className="stat-content">
            <h3>Avaliações</h3>
            <p className="stat-value">{stats.reviews.average.toFixed(1)} ⭐</p>
            <p className="stat-detail">{stats.reviews.total} avaliações</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>Pedidos por Dia (Última Semana)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.charts.orders_by_day}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ff6b35" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Vendas por Dia (Última Semana)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.charts.sales_by_day}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#4caf50" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Pratos */}
      {stats.dishes.top_rated.length > 0 && (
        <div className="top-dishes-section">
          <h3>Pratos Mais Bem Avaliados</h3>
          <div className="top-dishes-list">
            {stats.dishes.top_rated.map((dish, index) => (
              <div key={dish.id} className="top-dish-item">
                <span className="rank">#{index + 1}</span>
                <div className="dish-info">
                  <strong>{dish.name}</strong>
                  <span>{dish.average_rating} ⭐ ({dish.reviews_count} avaliações)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;