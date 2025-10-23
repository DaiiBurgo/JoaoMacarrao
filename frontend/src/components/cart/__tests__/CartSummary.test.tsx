/**
 * Testes para o componente CartSummary
 * João Macarrão - Sistema de Carrinho
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartSummary } from '../CartSummary';
import { useCartStore } from '../../../stores/cartStore';
import { BrowserRouter } from 'react-router-dom';

// Mock do store
vi.mock('../../../stores/cartStore', () => ({
  useCartStore: vi.fn()
}));

// Mock do useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper para Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CartSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Carrinho vazio', () => {
    beforeEach(() => {
      (useCartStore as any).mockReturnValue({
        items: [],
        deliveryFee: 5.00,
        subtotal: () => 0,
        total: () => 5.00,
        itemsCount: () => 0,
      });
    });

    it('deve mostrar mensagem de carrinho vazio', () => {
      renderWithRouter(<CartSummary />);
      
      expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument();
      expect(screen.getByText('Ver Cardápio')).toBeInTheDocument();
    });

    it('deve navegar para o menu quando clicar em Ver Cardápio', () => {
      renderWithRouter(<CartSummary />);
      
      const browseButton = screen.getByText('Ver Cardápio');
      fireEvent.click(browseButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/menu');
    });
  });

  describe('Carrinho com itens', () => {
    beforeEach(() => {
      (useCartStore as any).mockReturnValue({
        items: [
          {
            dish: { id: 1, name: 'Spaghetti', price: 35.90 },
            quantity: 2
          },
          {
            dish: { id: 2, name: 'Lasagna', price: 42.00 },
            quantity: 1
          }
        ],
        deliveryFee: 5.00,
        subtotal: () => 113.80, // (35.90 * 2) + 42.00
        total: () => 118.80, // 113.80 + 5.00
        itemsCount: () => 3, // 2 + 1
      });
    });

    it('deve renderizar o resumo do pedido corretamente', () => {
      renderWithRouter(<CartSummary />);
      
      expect(screen.getByText('Resumo do Pedido')).toBeInTheDocument();
      expect(screen.getByText('Itens (3)')).toBeInTheDocument();
      expect(screen.getByText('R$ 113.80')).toBeInTheDocument();
      expect(screen.getByText('Taxa de Entrega')).toBeInTheDocument();
      expect(screen.getByText('R$ 5.00')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('R$ 118.80')).toBeInTheDocument();
    });

    it('deve mostrar o botão de finalizar pedido por padrão', () => {
      renderWithRouter(<CartSummary />);
      
      expect(screen.getByText('Finalizar Pedido')).toBeInTheDocument();
    });

    it('deve navegar para o checkout quando clicar em Finalizar Pedido', () => {
      renderWithRouter(<CartSummary />);
      
      const checkoutButton = screen.getByText('Finalizar Pedido');
      fireEvent.click(checkoutButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/checkout');
    });

    it('não deve mostrar o botão de checkout quando showCheckoutButton é false', () => {
      renderWithRouter(<CartSummary showCheckoutButton={false} />);
      
      expect(screen.queryByText('Finalizar Pedido')).not.toBeInTheDocument();
    });

    it('deve aplicar className personalizada', () => {
      const { container } = renderWithRouter(<CartSummary className="custom-class" />);
      
      const summary = container.querySelector('.cart-summary');
      expect(summary?.classList.contains('custom-class')).toBe(true);
    });

    it('deve ter atributos de acessibilidade corretos', () => {
      renderWithRouter(<CartSummary />);
      
      const checkoutButton = screen.getByLabelText('Ir para o checkout');
      expect(checkoutButton).toBeInTheDocument();
    });
  });

  describe('Cálculos', () => {
    it('deve calcular corretamente com um único item', () => {
      (useCartStore as any).mockReturnValue({
        items: [
          {
            dish: { id: 1, name: 'Pizza', price: 50.00 },
            quantity: 1
          }
        ],
        deliveryFee: 10.00,
        subtotal: () => 50.00,
        total: () => 60.00,
        itemsCount: () => 1,
      });

      renderWithRouter(<CartSummary />);
      
      expect(screen.getByText('Itens (1)')).toBeInTheDocument();
      expect(screen.getByText('R$ 50.00')).toBeInTheDocument();
      expect(screen.getByText('R$ 10.00')).toBeInTheDocument();
      expect(screen.getByText('R$ 60.00')).toBeInTheDocument();
    });

    it('deve calcular corretamente com múltiplos itens e quantidades', () => {
      (useCartStore as any).mockReturnValue({
        items: [
          {
            dish: { id: 1, name: 'Item 1', price: 10.00 },
            quantity: 3
          },
          {
            dish: { id: 2, name: 'Item 2', price: 15.50 },
            quantity: 2
          }
        ],
        deliveryFee: 7.50,
        subtotal: () => 61.00, // (10 * 3) + (15.50 * 2)
        total: () => 68.50, // 61.00 + 7.50
        itemsCount: () => 5, // 3 + 2
      });

      renderWithRouter(<CartSummary />);
      
      expect(screen.getByText('Itens (5)')).toBeInTheDocument();
      expect(screen.getByText('R$ 61.00')).toBeInTheDocument();
      expect(screen.getByText('R$ 7.50')).toBeInTheDocument();
      expect(screen.getByText('R$ 68.50')).toBeInTheDocument();
    });
  });
});

