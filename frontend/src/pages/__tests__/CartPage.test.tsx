/**
 * Testes para a página CartPage
 * João Macarrão - Sistema de Carrinho
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartPage } from '../CartPage';
import { useCartStore } from '../../stores/cartStore';
import { BrowserRouter } from 'react-router-dom';

// Mock do store
vi.mock('../../stores/cartStore', () => ({
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

// Mock do confirm
global.confirm = vi.fn(() => true);

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CartPage', () => {
  const mockClearCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Carrinho vazio', () => {
    beforeEach(() => {
      (useCartStore as any).mockReturnValue({
        items: [],
        clearCart: mockClearCart,
      });
    });

    it('deve renderizar a página com carrinho vazio', () => {
      renderWithRouter(<CartPage />);
      
      expect(screen.getByRole('heading', { name: /carrinho/i })).toBeInTheDocument();
      expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument();
      expect(screen.getByText('Adicione itens do cardápio para começar seu pedido')).toBeInTheDocument();
    });

    it('deve mostrar botão para ver cardápio quando vazio', () => {
      renderWithRouter(<CartPage />);
      
      const menuButton = screen.getByText('Ver Cardápio');
      expect(menuButton).toBeInTheDocument();
    });

    it('deve navegar para o menu ao clicar em Ver Cardápio', () => {
      renderWithRouter(<CartPage />);
      
      const menuButton = screen.getByText('Ver Cardápio');
      fireEvent.click(menuButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/menu');
    });

    it('não deve mostrar botão de limpar carrinho quando vazio', () => {
      renderWithRouter(<CartPage />);
      
      expect(screen.queryByText('Limpar Carrinho')).not.toBeInTheDocument();
    });
  });

  describe('Carrinho com itens', () => {
    const mockItems = [
      {
        dish: {
          id: 1,
          name: 'Spaghetti Carbonara',
          description: 'Massa italiana',
          price: 35.90,
          image: 'https://example.com/spaghetti.jpg',
          category: 1,
          is_available: true,
          preparation_time: 30,
          ingredients: [],
          allergens: [],
          is_vegetarian: false,
          is_vegan: false,
          is_gluten_free: false,
        },
        quantity: 2,
        notes: '',
      },
      {
        dish: {
          id: 2,
          name: 'Lasagna',
          description: 'Lasagna bolonhesa',
          price: 42.00,
          image: 'https://example.com/lasagna.jpg',
          category: 1,
          is_available: true,
          preparation_time: 45,
          ingredients: [],
          allergens: [],
          is_vegetarian: false,
          is_vegan: false,
          is_gluten_free: false,
        },
        quantity: 1,
        notes: '',
      },
    ];

    beforeEach(() => {
      (useCartStore as any).mockReturnValue({
        items: mockItems,
        clearCart: mockClearCart,
      });
    });

    it('deve renderizar todos os itens do carrinho', () => {
      renderWithRouter(<CartPage />);
      
      expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
      expect(screen.getByText('Lasagna')).toBeInTheDocument();
      expect(screen.getByText('Itens do Pedido (2)')).toBeInTheDocument();
    });

    it('deve mostrar botão de limpar carrinho quando há itens', () => {
      renderWithRouter(<CartPage />);
      
      expect(screen.getByText('Limpar Carrinho')).toBeInTheDocument();
    });

    it('deve pedir confirmação ao limpar carrinho', () => {
      renderWithRouter(<CartPage />);
      
      const clearButton = screen.getByText('Limpar Carrinho');
      fireEvent.click(clearButton);
      
      expect(global.confirm).toHaveBeenCalledWith('Deseja realmente limpar o carrinho?');
      expect(mockClearCart).toHaveBeenCalled();
    });

    it('não deve limpar carrinho se usuário cancelar', () => {
      (global.confirm as any).mockReturnValueOnce(false);
      
      renderWithRouter(<CartPage />);
      
      const clearButton = screen.getByText('Limpar Carrinho');
      fireEvent.click(clearButton);
      
      expect(mockClearCart).not.toHaveBeenCalled();
    });

    it('deve mostrar o CartSummary', () => {
      renderWithRouter(<CartPage />);
      
      expect(screen.getByText('Resumo do Pedido')).toBeInTheDocument();
    });

    it('deve mostrar dica de observações', () => {
      renderWithRouter(<CartPage />);
      
      expect(screen.getByText('💡 Dica')).toBeInTheDocument();
      expect(screen.getByText(/adicionar observações especiais/i)).toBeInTheDocument();
    });
  });

  describe('Navegação', () => {
    beforeEach(() => {
      (useCartStore as any).mockReturnValue({
        items: [],
        clearCart: mockClearCart,
      });
    });

    it('deve ter botão de voltar', () => {
      renderWithRouter(<CartPage />);
      
      const backButton = screen.getByLabelText('Voltar');
      expect(backButton).toBeInTheDocument();
    });

    it('deve navegar para página anterior ao clicar em voltar', () => {
      renderWithRouter(<CartPage />);
      
      const backButton = screen.getByLabelText('Voltar');
      fireEvent.click(backButton);
      
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  describe('Acessibilidade', () => {
    beforeEach(() => {
      (useCartStore as any).mockReturnValue({
        items: [],
        clearCart: mockClearCart,
      });
    });

    it('deve ter título com heading correto', () => {
      renderWithRouter(<CartPage />);
      
      const heading = screen.getByRole('heading', { name: /carrinho/i });
      expect(heading).toBeInTheDocument();
    });

    it('deve ter labels de acessibilidade nos botões', () => {
      renderWithRouter(<CartPage />);
      
      expect(screen.getByLabelText('Voltar')).toBeInTheDocument();
    });

    it('deve ter label de acessibilidade no botão limpar quando há itens', () => {
      (useCartStore as any).mockReturnValue({
        items: [
          {
            dish: { id: 1, name: 'Test', price: 10 },
            quantity: 1,
            notes: '',
          }
        ],
        clearCart: mockClearCart,
      });

      renderWithRouter(<CartPage />);
      
      expect(screen.getByLabelText('Limpar carrinho')).toBeInTheDocument();
    });
  });
});

