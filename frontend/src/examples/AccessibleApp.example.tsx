/**
 * Exemplo de aplicação React com recursos completos de acessibilidade
 * 
 * Este arquivo demonstra como integrar todos os hooks e componentes
 * de acessibilidade em uma aplicação React real.
 */

import React, { useRef, useState } from 'react';
import { AccessibilityProvider } from '../contexts/AccessibilityContext';
import AccessibilityToolbar from '../components/AccessibilityToolbar';
import {
  useKeyboardNavigation,
  useFocusTrap,
  useAriaAnnouncer,
  useScreenReader,
  useTextToSpeech,
} from '../hooks';

// ============================
// Componente de Menu com navegação por teclado
// ============================
function AccessibleMenu() {
  const menuRef = useRef<HTMLElement>(null);
  const { announceNavigation } = useAriaAnnouncer();

  useKeyboardNavigation(menuRef, {
    selector: 'a, button',
    loop: true,
    onFocus: (element) => {
      console.log('Focado:', element.textContent);
    },
    onSelect: (element) => {
      announceNavigation(element.textContent || 'página');
      // Simula navegação
      console.log('Navegando para:', element.textContent);
    },
  });

  return (
    <nav ref={menuRef} role="navigation" aria-label="Menu principal">
      <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', padding: 0 }}>
        <li><a href="#home">Home</a></li>
        <li><a href="#produtos">Produtos</a></li>
        <li><a href="#sobre">Sobre</a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>
    </nav>
  );
}

// ============================
// Modal acessível com armadilha de foco
// ============================
function AccessibleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { announceInfo } = useAriaAnnouncer();

  useFocusTrap(modalRef, isOpen, {
    autoFocus: true,
    restoreFocus: true,
    onActivate: () => {
      announceInfo('Modal aberto');
    },
    onDeactivate: () => {
      announceInfo('Modal fechado');
    },
  });

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
        }}
      >
        <h2 id="modal-title">Modal Acessível</h2>
        <p>
          Este modal utiliza armadilha de foco. Pressione Tab para navegar
          entre os elementos. Pressione Esc para fechar.
        </p>
        
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={onClose} style={{ backgroundColor: '#0066cc', color: 'white' }}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================
// Formulário acessível com anúncios
// ============================
function AccessibleForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const { announceSuccess, announceError } = useAriaAnnouncer();
  const { announce } = useScreenReader();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      announceError('Por favor, preencha todos os campos');
      return;
    }

    // Simula envio
    setTimeout(() => {
      announceSuccess('Formulário enviado com sucesso!');
      setFormData({ name: '', email: '' });
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '20px 0' }}>
      <h3>Cadastro</h3>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>
          Nome:
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          aria-required="true"
          aria-describedby="name-help"
          style={{ width: '100%', padding: '8px' }}
        />
        <span id="name-help" style={{ fontSize: '12px', color: '#666' }}>
          Digite seu nome completo
        </span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
          E-mail:
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          aria-required="true"
          aria-describedby="email-help"
          style={{ width: '100%', padding: '8px' }}
        />
        <span id="email-help" style={{ fontSize: '12px', color: '#666' }}>
          Digite um e-mail válido
        </span>
      </div>

      <button
        type="submit"
        style={{
          padding: '10px 20px',
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Enviar
      </button>
    </form>
  );
}

// ============================
// Lista de produtos com TTS
// ============================
function ProductList() {
  const { speakText, isEnabled: ttsEnabled } = useTextToSpeech();
  const { announceCount } = useAriaAnnouncer();

  const products = [
    { id: 1, name: 'Produto 1', price: 'R$ 50,00' },
    { id: 2, name: 'Produto 2', price: 'R$ 75,00' },
    { id: 3, name: 'Produto 3', price: 'R$ 100,00' },
  ];

  React.useEffect(() => {
    announceCount(products.length, 'produtos encontrados');
  }, [products.length, announceCount]);

  const handleReadProduct = (product: typeof products[0]) => {
    speakText(`${product.name}, preço: ${product.price}`);
  };

  return (
    <section aria-label="Lista de produtos">
      <h3>Produtos</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map((product) => (
          <li
            key={product.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '15px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>{product.name}</h4>
              <p style={{ margin: 0, color: '#666' }}>{product.price}</p>
            </div>
            {ttsEnabled && (
              <button
                onClick={() => handleReadProduct(product)}
                aria-label={`Ler descrição de ${product.name}`}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                🔊
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

// ============================
// Aplicação principal
// ============================
function AccessibleAppExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AccessibilityProvider>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Cabeçalho */}
        <header role="banner">
          <h1>Exemplo de Aplicação Acessível</h1>
          <p>
            Esta aplicação demonstra o uso completo dos recursos de acessibilidade.
          </p>
        </header>

        {/* Menu */}
        <AccessibleMenu />

        {/* Conteúdo principal */}
        <main role="main" style={{ marginTop: '30px' }}>
          {/* Botão para abrir modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '20px',
            }}
          >
            Abrir Modal
          </button>

          {/* Formulário */}
          <AccessibleForm />

          {/* Lista de produtos */}
          <ProductList />

          {/* Informações adicionais */}
          <section style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <h3>Recursos de Acessibilidade Disponíveis</h3>
            <ul>
              <li>✅ Navegação por teclado (Tab, Setas, Enter, Esc)</li>
              <li>✅ Suporte a leitores de tela</li>
              <li>✅ Text-to-Speech (TTS)</li>
              <li>✅ Alto contraste</li>
              <li>✅ Ajuste de tamanho de fonte</li>
              <li>✅ Leitura simplificada</li>
              <li>✅ LIBRAS</li>
              <li>✅ Atalhos de teclado (Ctrl+Alt+H, Ctrl+Alt+S, etc)</li>
              <li>✅ Armadilha de foco em modais</li>
              <li>✅ Anúncios ARIA</li>
            </ul>
          </section>
        </main>

        {/* Rodapé */}
        <footer role="contentinfo" style={{ marginTop: '40px', padding: '20px', borderTop: '1px solid #ddd' }}>
          <p>© 2025 - Aplicação Acessível</p>
        </footer>

        {/* Modal */}
        <AccessibleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        {/* Barra de ferramentas de acessibilidade */}
        <AccessibilityToolbar />
      </div>
    </AccessibilityProvider>
  );
}

export default AccessibleAppExample;

