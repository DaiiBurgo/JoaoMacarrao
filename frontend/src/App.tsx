import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styles
import './styles/theme.css';
import './styles/animations.css';
import './styles/rustic-textures.css';
import './styles/accessibility.css';
import './styles/components.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AccessibilityToolbar from './components/AccessibilityToolbar';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import DishDetailPage from './pages/DishDetailPage';
import OrdersPage from './pages/OrdersPage';
import MenuPage from './pages/MenuPage';
import AdminDashboard from './pages/AdminDashboard';

// Context
import { AccessibilityProvider } from './contexts/AccessibilityContext';

// Store
import { useCartStore } from './stores/cartStore';

const App: React.FC = () => {
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AccessibilityProvider>
      <Router>
        <div className="app">
          {/* Skip to main content link for accessibility */}
          <a href="#main-content" className="skip-link sr-only-focusable">
            Pular para o conteúdo principal
          </a>

          {/* Accessibility Toolbar */}
          <AccessibilityToolbar />

          {/* Navigation */}
          <Navbar cartItemCount={cartItemCount} />

          {/* Main Content */}
          <main id="main-content" role="main">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/dish/:id" element={<DishDetailPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/menu" element={<MenuPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Fallback - 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Toast Notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            aria-live="polite"
            role="alert"
          />
        </div>
      </Router>
    </AccessibilityProvider>
  );
};

// 404 Page Component
const NotFoundPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
        404
      </h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-secondary)' }}>
        Página não encontrada
      </h2>
      <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: 'var(--color-text-light)' }}>
        Desculpe, a página que você procura não existe.
      </p>
      <a href="/" className="btn btn-primary btn-lg">
        Voltar para o início
      </a>
    </div>
  );
};

export default App;

