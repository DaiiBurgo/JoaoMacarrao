/**
 * Store do carrinho usando Zustand
 * João Macarrão - Sistema de Carrinho
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Dish } from '../types/order';

interface CartStore {
  items: CartItem[];
  deliveryFee: number;
  
  // Getters computados
  subtotal: () => number;
  total: () => number;
  itemsCount: () => number;
  
  // Actions
  addItem: (dish: Dish, quantity?: number, notes?: string) => void;
  removeItem: (dishId: number) => void;
  updateQuantity: (dishId: number, quantity: number) => void;
  updateNotes: (dishId: number, notes: string) => void;
  clearCart: () => void;
  setDeliveryFee: (fee: number) => void;
  
  // Utilitários
  getItem: (dishId: number) => CartItem | undefined;
  hasItem: (dishId: number) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryFee: 5.00, // Taxa padrão
      
      // Getters computados
      subtotal: () => {
        const state = get();
        return state.items.reduce(
          (sum, item) => sum + (item.dish.price * item.quantity),
          0
        );
      },
      
      total: () => {
        const state = get();
        return state.subtotal() + state.deliveryFee;
      },
      
      itemsCount: () => {
        const state = get();
        return state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      },
      
      // Actions
      addItem: (dish: Dish, quantity = 1, notes = '') => {
        const state = get();
        const existingItemIndex = state.items.findIndex(
          item => item.dish.id === dish.id
        );
        
        if (existingItemIndex > -1) {
          // Item já existe, incrementa quantidade
          const newItems = [...state.items];
          newItems[existingItemIndex].quantity += quantity;
          if (notes) {
            newItems[existingItemIndex].notes = notes;
          }
          set({ items: newItems });
        } else {
          // Novo item
          set({
            items: [...state.items, { dish, quantity, notes }]
          });
        }
      },
      
      removeItem: (dishId: number) => {
        const state = get();
        set({
          items: state.items.filter(item => item.dish.id !== dishId)
        });
      },
      
      updateQuantity: (dishId: number, quantity: number) => {
        const state = get();
        if (quantity <= 0) {
          // Remove item se quantidade for 0
          get().removeItem(dishId);
          return;
        }
        
        const newItems = state.items.map(item =>
          item.dish.id === dishId
            ? { ...item, quantity }
            : item
        );
        set({ items: newItems });
      },
      
      updateNotes: (dishId: number, notes: string) => {
        const state = get();
        const newItems = state.items.map(item =>
          item.dish.id === dishId
            ? { ...item, notes }
            : item
        );
        set({ items: newItems });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      setDeliveryFee: (fee: number) => {
        set({ deliveryFee: fee });
      },
      
      // Utilitários
      getItem: (dishId: number) => {
        const state = get();
        return state.items.find(item => item.dish.id === dishId);
      },
      
      hasItem: (dishId: number) => {
        const state = get();
        return state.items.some(item => item.dish.id === dishId);
      }
    }),
    {
      name: 'joao-macarrao-cart', // Nome no localStorage
      partialize: (state) => ({
        items: state.items,
        deliveryFee: state.deliveryFee
      })
    }
  )
);

