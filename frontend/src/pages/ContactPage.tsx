/**
 * Página de Contato
 * João Macarrão - Sistema de Contato
 */
import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { ContactForm } from '../components/contact/ContactForm';

export const ContactPage: React.FC = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <header className="contact-header">
          <h1>Entre em Contato</h1>
          <p>Estamos aqui para ajudar! Envie sua mensagem e responderemos em breve.</p>
        </header>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Informações</h2>

            <div className="info-item">
              <MapPin size={24} />
              <div>
                <strong>Endereço</strong>
                <p>Rua das Massas, 123<br />São Paulo - SP, 01234-567</p>
              </div>
            </div>

            <div className="info-item">
              <Phone size={24} />
              <div>
                <strong>Telefone</strong>
                <p>(11) 3456-7890<br />(11) 99999-9999</p>
              </div>
            </div>

            <div className="info-item">
              <Mail size={24} />
              <div>
                <strong>E-mail</strong>
                <p>contato@joaomacarrao.com</p>
              </div>
            </div>

            <div className="info-item">
              <Clock size={24} />
              <div>
                <strong>Horário</strong>
                <p>Segunda a Sábado<br />11h às 23h</p>
                <p>Domingo<br />11h às 22h</p>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

