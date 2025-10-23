import React from 'react';
import { MapPin, Clock, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';
import '../styles/footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        {/* Logo e Descrição */}
        <div className="footer-section footer-brand">
          <div className="footer-logo">
            <img 
              src="/assets/LOGOTIPO_JOAO_MACARRAO_page.png" 
              alt="João Macarrão" 
              className="footer-logo-image"
            />
            <div className="footer-logo-text">
              <span className="footer-tagline">Com o sabor autêntico do litoral</span>
            </div>
          </div>
          <p className="footer-description">
            Massas artesanais e frutos do mar. 
            Tradição, qualidade e acessibilidade em cada prato.
          </p>
          <div className="footer-social">
            <a
              href="https://www.instagram.com/joaomacarrao013?igsh=MTh3MnBoeWdhMmZtMg=="
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Siga-nos no Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://wa.me/5513981669000"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link social-link-whatsapp"
              aria-label="Fale conosco no WhatsApp"
            >
              <Phone size={20} />
            </a>
            <a
              href="https://www.ifood.com.br/delivery/bertioga-sp/joao-macarrao-maitinga/5fd00482-a61c-48d6-a25a-a2edae29d59f?UTM_Medium=share"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link social-link-ifood"
              aria-label="Peça pelo iFood"
              style={{fontSize: '20px'}}
            >
              🍽️
            </a>
          </div>
        </div>

        {/* Contato */}
        <div className="footer-section">
          <h3 className="footer-title">Contato</h3>
          <ul className="footer-list">
            <li className="footer-item">
              <Phone size={18} className="footer-icon" aria-hidden="true" />
              <div>
                <strong>WhatsApp</strong>
                <a href="https://wa.me/5513981669000" className="footer-link" target="_blank" rel="noopener noreferrer">
                  (13) 98166-9000
                </a>
              </div>
            </li>
            <li className="footer-item">
              <span className="footer-icon" style={{fontSize: '18px'}} aria-hidden="true">🍽️</span>
              <div>
                <strong>iFood</strong>
                <a href="https://www.ifood.com.br/delivery/bertioga-sp/joao-macarrao-maitinga/5fd00482-a61c-48d6-a25a-a2edae29d59f?UTM_Medium=share" className="footer-link" target="_blank" rel="noopener noreferrer">
                  Faça seu pedido
                </a>
              </div>
            </li>
          </ul>
        </div>

        {/* Localização */}
        <div className="footer-section">
          <h3 className="footer-title">Localização</h3>
          <ul className="footer-list">
            <li className="footer-item">
              <MapPin size={18} className="footer-icon" aria-hidden="true" />
              <div>
                <strong>Endereço</strong>
                <address className="footer-address">
                  Av. Anchieta, 2969 - Maitinga<br />
                  Bertioga - SP<br />
                  CEP: 11251-175<br />
                  <small>Centro Comercial Maitinga</small>
                </address>
                <a 
                  href="https://www.google.com/maps/place/5V8G%2BQ4+Maitinga,+Bertioga+-+SP/@-23.8329375,-46.1246875,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                  style={{marginTop: '0.5rem', display: 'inline-block'}}
                >
                  📍 Ver no mapa
                </a>
              </div>
            </li>
          </ul>
        </div>

        {/* Horário */}
        <div className="footer-section">
          <h3 className="footer-title">Horário de Funcionamento</h3>
          <ul className="footer-list">
            <li className="footer-item">
              <Clock size={18} className="footer-icon" aria-hidden="true" />
              <div>
                <strong>Terça a Sábado</strong>
                <p className="footer-hours">18:00 - 23:00</p>
              </div>
            </li>
            <li className="footer-item">
              <Clock size={18} className="footer-icon" aria-hidden="true" />
              <div>
                <strong>Domingo e Segunda</strong>
                <p className="footer-hours">Fechado</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="footer-copyright">
            © {currentYear} João Macarrão. Todos os direitos reservados.
          </p>
          <div className="footer-links">
            <a href="/privacy" className="footer-bottom-link">
              Política de Privacidade
            </a>
            <span className="footer-separator">•</span>
            <a href="/terms" className="footer-bottom-link">
              Termos de Uso
            </a>
            <span className="footer-separator">•</span>
            <a href="/accessibility" className="footer-bottom-link">
              Acessibilidade
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="footer-wave" aria-hidden="true">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,50 C150,80 350,0 600,50 C850,100 1050,20 1200,50 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </footer>
  );
};

export default Footer;

