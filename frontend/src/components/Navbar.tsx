import React, { useState } from 'react';
import { Menu, X, Phone, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

interface NavbarProps {
  cartItemCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartItemCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Menu principal">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu} aria-label="João Macarrão - Página Inicial">
          <img 
            src="/assets/LOGOTIPO_JOAO_MACARRAO_page.png" 
            alt="João Macarrão" 
            className="logo-image"
          />
          <span className="logo-tagline">Com o sabor autêntico do litoral</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-toggle"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li>
              <Link
                to="/"
                className={`navbar-link ${isActive('/')}`}
                onClick={closeMenu}
              >
                Cardápio
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`navbar-link ${isActive('/about')}`}
                onClick={closeMenu}
              >
                Sobre
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`navbar-link ${isActive('/contact')}`}
                onClick={closeMenu}
              >
                Contato
              </Link>
            </li>
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            {/* Cart Button */}
            <Link to="/cart" className="btn-cart" aria-label={`Carrinho com ${cartItemCount} itens`}>
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="cart-badge" aria-label={`${cartItemCount} itens no carrinho`}>
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* iFood CTA */}
            <a
              href="https://www.ifood.com.br/delivery/bertioga-sp/joao-macarrao-maitinga/5fd00482-a61c-48d6-a25a-a2edae29d59f?UTM_Medium=share"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ifood"
              aria-label="Peça pelo iFood"
            >
              <span>🍽️</span>
              <span>Peça no iFood</span>
            </a>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/5513981669000?text=Olá!%20Gostaria%20de%20fazer%20um%20pedido"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              aria-label="Fazer pedido pelo WhatsApp"
            >
              <Phone size={18} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

