/**
 * Testes para o componente CartItem
 * João Macarrão - Sistema de Carrinho
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartItem } from '../CartItem';
import { useCartStore } from '../../../stores/cartStore';
import type { CartItem as CartItemType } from '../../../types/order';

// Mock do store
vi.mock('../../../stores/cartStore', () => ({
  useCartStore: vi.fn()
}));

// Mock do confirm do window
global.confirm = vi.fn(() => true);

describe('CartItem', () => {
  const mockUpdateQuantity = vi.fn();
  const mockRemoveItem = vi.fn();
  const mockUpdateNotes = vi.fn();

  const mockItem: CartItemType = {
    dish: {
      id: 1,
      name: 'Spaghetti Carbonara',
      description: 'Massa italiana com bacon e ovos',
      price: 35.90,
      image: 'https://example.com/spaghetti.jpg',
      category: 1,
      is_available: true,
      preparation_time: 30,
      ingredients: ['Massa', 'Bacon', 'Ovos'],
      allergens: [],
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
    },
    quantity: 2,
    notes: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useCartStore as any).mockReturnValue({
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      updateNotes: mockUpdateNotes,
    });
  });

  it('deve renderizar o item corretamente', () => {
    render(<CartItem item={mockItem} />);
    
    expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
    expect(screen.getByText('Massa italiana com bacon e ovos')).toBeInTheDocument();
    expect(screen.getByText('R$ 35.90')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('deve calcular o total do item corretamente', () => {
    render(<CartItem item={mockItem} />);
    
    const total = mockItem.dish.price * mockItem.quantity;
    expect(screen.getByText(`R$ ${total.toFixed(2)}`)).toBeInTheDocument();
  });

  it('deve aumentar a quantidade quando clicar no botão +', () => {
    render(<CartItem item={mockItem} />);
    
    const increaseButton = screen.getByLabelText('Aumentar quantidade');
    fireEvent.click(increaseButton);
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith(mockItem.dish.id, 3);
  });

  it('deve diminuir a quantidade quando clicar no botão -', () => {
    render(<CartItem item={mockItem} />);
    
    const decreaseButton = screen.getByLabelText('Diminuir quantidade');
    fireEvent.click(decreaseButton);
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith(mockItem.dish.id, 1);
  });

  it('deve pedir confirmação ao tentar zerar a quantidade', () => {
    const itemWithOneQuantity = { ...mockItem, quantity: 1 };
    render(<CartItem item={itemWithOneQuantity} />);
    
    const decreaseButton = screen.getByLabelText('Diminuir quantidade');
    fireEvent.click(decreaseButton);
    
    expect(global.confirm).toHaveBeenCalledWith('Deseja remover este item do carrinho?');
    expect(mockRemoveItem).toHaveBeenCalledWith(mockItem.dish.id);
  });

  it('deve remover o item quando clicar no botão de remover', () => {
    render(<CartItem item={mockItem} />);
    
    const removeButton = screen.getByLabelText('Remover item do carrinho');
    fireEvent.click(removeButton);
    
    expect(mockRemoveItem).toHaveBeenCalledWith(mockItem.dish.id);
  });

  it('deve mostrar o campo de edição de observações quando clicar em adicionar observações', () => {
    render(<CartItem item={mockItem} />);
    
    const editButton = screen.getByLabelText('Editar observações');
    fireEvent.click(editButton);
    
    expect(screen.getByPlaceholderText('Observações do pedido...')).toBeInTheDocument();
  });

  it('deve salvar as observações quando clicar em Salvar', async () => {
    render(<CartItem item={mockItem} />);
    
    // Abre o editor de observações
    const editButton = screen.getByLabelText('Editar observações');
    fireEvent.click(editButton);
    
    // Digita as observações
    const textarea = screen.getByPlaceholderText('Observações do pedido...');
    fireEvent.change(textarea, { target: { value: 'Sem cebola, por favor' } });
    
    // Salva
    const saveButton = screen.getByLabelText('Salvar observações');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockUpdateNotes).toHaveBeenCalledWith(mockItem.dish.id, 'Sem cebola, por favor');
    });
  });

  it('deve cancelar a edição de observações quando clicar em Cancelar', () => {
    render(<CartItem item={mockItem} />);
    
    // Abre o editor de observações
    const editButton = screen.getByLabelText('Editar observações');
    fireEvent.click(editButton);
    
    // Digita as observações
    const textarea = screen.getByPlaceholderText('Observações do pedido...');
    fireEvent.change(textarea, { target: { value: 'Sem cebola' } });
    
    // Cancela
    const cancelButton = screen.getByLabelText('Cancelar edição');
    fireEvent.click(cancelButton);
    
    // Deve esconder o textarea
    expect(screen.queryByPlaceholderText('Observações do pedido...')).not.toBeInTheDocument();
    expect(mockUpdateNotes).not.toHaveBeenCalled();
  });

  it('deve mostrar observações existentes', () => {
    const itemWithNotes = { ...mockItem, notes: 'Bem passado' };
    render(<CartItem item={itemWithNotes} />);
    
    expect(screen.getByText('Bem passado')).toBeInTheDocument();
  });

  it('não deve mostrar controles de edição quando editable é false', () => {
    render(<CartItem item={mockItem} editable={false} />);
    
    expect(screen.queryByLabelText('Aumentar quantidade')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Diminuir quantidade')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Remover item do carrinho')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Editar observações')).not.toBeInTheDocument();
  });

  it('deve mostrar placeholder quando não há imagem', () => {
    const itemWithoutImage = {
      ...mockItem,
      dish: { ...mockItem.dish, image: '' }
    };
    render(<CartItem item={itemWithoutImage} />);
    
    expect(screen.getByText('🍝')).toBeInTheDocument();
  });

  it('deve ter atributos de acessibilidade corretos', () => {
    render(<CartItem item={mockItem} />);
    
    expect(screen.getByLabelText('Aumentar quantidade')).toBeInTheDocument();
    expect(screen.getByLabelText('Diminuir quantidade')).toBeInTheDocument();
    expect(screen.getByLabelText(`Quantidade: ${mockItem.quantity}`)).toBeInTheDocument();
    expect(screen.getByLabelText('Remover item do carrinho')).toBeInTheDocument();
  });
});

