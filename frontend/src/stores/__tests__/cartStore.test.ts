/**
 * Testes para o cartStore
 * João Macarrão - Sistema de Carrinho
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../cartStore';
import type { Dish } from '../../types/order';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('cartStore', () => {
  const mockDish: Dish = {
    id: 1,
    name: 'Spaghetti Carbonara',
    description: 'Massa italiana',
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
  };

  const mockDish2: Dish = {
    id: 2,
    name: 'Lasagna',
    description: 'Lasagna bolonhesa',
    price: 42.00,
    image: 'https://example.com/lasagna.jpg',
    category: 1,
    is_available: true,
    preparation_time: 45,
    ingredients: ['Massa', 'Carne', 'Molho'],
    allergens: [],
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
  };

  beforeEach(() => {
    // Limpa o store antes de cada teste
    useCartStore.getState().clearCart();
    localStorage.clear();
  });

  describe('Estado inicial', () => {
    it('deve iniciar com carrinho vazio', () => {
      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
    });

    it('deve ter taxa de entrega padrão', () => {
      const state = useCartStore.getState();
      expect(state.deliveryFee).toBe(5.00);
    });

    it('deve calcular subtotal como 0 quando vazio', () => {
      const state = useCartStore.getState();
      expect(state.subtotal()).toBe(0);
    });

    it('deve calcular total como taxa de entrega quando vazio', () => {
      const state = useCartStore.getState();
      expect(state.total()).toBe(5.00);
    });

    it('deve contar 0 itens quando vazio', () => {
      const state = useCartStore.getState();
      expect(state.itemsCount()).toBe(0);
    });
  });

  describe('addItem', () => {
    it('deve adicionar um novo item ao carrinho', () => {
      const { addItem, items } = useCartStore.getState();
      
      addItem(mockDish, 1);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].dish.id).toBe(mockDish.id);
      expect(state.items[0].quantity).toBe(1);
    });

    it('deve incrementar quantidade se item já existe', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(mockDish, 1);
      addItem(mockDish, 2);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3);
    });

    it('deve adicionar notas ao item', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(mockDish, 1, 'Sem cebola');
      
      const state = useCartStore.getState();
      expect(state.items[0].notes).toBe('Sem cebola');
    });

    it('deve atualizar notas se item já existe e novas notas são fornecidas', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(mockDish, 1, 'Sem cebola');
      addItem(mockDish, 1, 'Bem passado');
      
      const state = useCartStore.getState();
      expect(state.items[0].notes).toBe('Bem passado');
      expect(state.items[0].quantity).toBe(2);
    });

    it('deve adicionar múltiplos itens diferentes', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(mockDish, 1);
      addItem(mockDish2, 2);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2);
      expect(state.items[0].dish.id).toBe(mockDish.id);
      expect(state.items[1].dish.id).toBe(mockDish2.id);
    });
  });

  describe('removeItem', () => {
    it('deve remover item do carrinho', () => {
      const { addItem, removeItem } = useCartStore.getState();
      
      addItem(mockDish, 1);
      removeItem(mockDish.id);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it('não deve afetar outros itens ao remover um específico', () => {
      const { addItem, removeItem } = useCartStore.getState();
      
      addItem(mockDish, 1);
      addItem(mockDish2, 1);
      removeItem(mockDish.id);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].dish.id).toBe(mockDish2.id);
    });
  });

  describe('updateQuantity', () => {
    it('deve atualizar a quantidade de um item', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      
      addItem(mockDish, 1);
      updateQuantity(mockDish.id, 5);
      
      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(5);
    });

    it('deve remover item se quantidade for 0', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      
      addItem(mockDish, 2);
      updateQuantity(mockDish.id, 0);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });

    it('deve remover item se quantidade for negativa', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      
      addItem(mockDish, 2);
      updateQuantity(mockDish.id, -1);
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe('updateNotes', () => {
    it('deve atualizar as notas de um item', () => {
      const { addItem, updateNotes } = useCartStore.getState();
      
      addItem(mockDish, 1);
      updateNotes(mockDish.id, 'Bem passado');
      
      const state = useCartStore.getState();
      expect(state.items[0].notes).toBe('Bem passado');
    });

    it('não deve afetar outros itens ao atualizar notas', () => {
      const { addItem, updateNotes } = useCartStore.getState();
      
      addItem(mockDish, 1, 'Nota 1');
      addItem(mockDish2, 1, 'Nota 2');
      updateNotes(mockDish.id, 'Nova nota 1');
      
      const state = useCartStore.getState();
      expect(state.items[0].notes).toBe('Nova nota 1');
      expect(state.items[1].notes).toBe('Nota 2');
    });
  });

  describe('clearCart', () => {
    it('deve limpar todos os itens do carrinho', () => {
      const { addItem, clearCart } = useCartStore.getState();
      
      addItem(mockDish, 1);
      addItem(mockDish2, 2);
      clearCart();
      
      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
    });
  });

  describe('setDeliveryFee', () => {
    it('deve atualizar a taxa de entrega', () => {
      const { setDeliveryFee } = useCartStore.getState();
      
      setDeliveryFee(10.00);
      
      const state = useCartStore.getState();
      expect(state.deliveryFee).toBe(10.00);
    });
  });

  describe('Cálculos', () => {
    it('deve calcular subtotal corretamente com um item', () => {
      const { addItem, subtotal } = useCartStore.getState();
      
      addItem(mockDish, 2); // 35.90 * 2 = 71.80
      
      expect(subtotal()).toBe(71.80);
    });

    it('deve calcular subtotal corretamente com múltiplos itens', () => {
      const { addItem, subtotal } = useCartStore.getState();
      
      addItem(mockDish, 2);  // 35.90 * 2 = 71.80
      addItem(mockDish2, 1); // 42.00 * 1 = 42.00
      // Total: 113.80
      
      expect(subtotal()).toBe(113.80);
    });

    it('deve calcular total incluindo taxa de entrega', () => {
      const { addItem, total } = useCartStore.getState();
      
      addItem(mockDish, 1); // 35.90
      // Com taxa de 5.00 = 40.90
      
      expect(total()).toBe(40.90);
    });

    it('deve contar total de itens corretamente', () => {
      const { addItem, itemsCount } = useCartStore.getState();
      
      addItem(mockDish, 2);
      addItem(mockDish2, 3);
      
      expect(itemsCount()).toBe(5);
    });
  });

  describe('Utilitários', () => {
    it('getItem deve retornar o item correto', () => {
      const { addItem, getItem } = useCartStore.getState();
      
      addItem(mockDish, 1);
      const item = getItem(mockDish.id);
      
      expect(item).toBeDefined();
      expect(item?.dish.id).toBe(mockDish.id);
    });

    it('getItem deve retornar undefined para item inexistente', () => {
      const { getItem } = useCartStore.getState();
      
      const item = getItem(999);
      
      expect(item).toBeUndefined();
    });

    it('hasItem deve retornar true para item existente', () => {
      const { addItem, hasItem } = useCartStore.getState();
      
      addItem(mockDish, 1);
      
      expect(hasItem(mockDish.id)).toBe(true);
    });

    it('hasItem deve retornar false para item inexistente', () => {
      const { hasItem } = useCartStore.getState();
      
      expect(hasItem(999)).toBe(false);
    });
  });

  describe('Persistência', () => {
    it('deve salvar itens no localStorage', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(mockDish, 1);
      
      const saved = localStorage.getItem('joao-macarrao-cart');
      expect(saved).toBeTruthy();
      
      if (saved) {
        const parsed = JSON.parse(saved);
        expect(parsed.state.items).toHaveLength(1);
      }
    });
  });
});

