/**
 * Tipos TypeScript para sistema de pedidos
 * João Macarrão - Sistema de Pedidos
 */

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivering'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 
  | 'money'
  | 'debit'
  | 'credit'
  | 'pix'
  | 'online';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: number;
  available: boolean;
  stock: number;
}

export interface OrderItem {
  id?: number;
  dish_id: number;
  dish_name?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes?: string;
}

export interface Order {
  id: number;
  user: number;
  user_name?: string;
  user_email?: string;
  status: OrderStatus;
  status_display?: string;
  payment_method: PaymentMethod;
  payment_method_display?: string;
  payment_status: PaymentStatus;
  delivery_address: string;
  delivery_city: string;
  delivery_zip_code?: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  notes?: string;
  items: OrderItem[];
  items_count?: number;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
  delivered_at?: string;
}

export interface OrderCreateData {
  payment_method: PaymentMethod;
  delivery_address: string;
  delivery_city: string;
  delivery_zip_code?: string;
  delivery_fee: number;
  notes?: string;
  items: {
    dish_id: number;
    quantity: number;
    notes?: string;
  }[];
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  notes?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  items_count: number;
}

// Status displays
export const OrderStatusDisplay: Record<OrderStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  preparing: 'Em Preparo',
  ready: 'Pronto',
  delivering: 'Em Entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado'
};

export const OrderStatusIcon: Record<OrderStatus, string> = {
  pending: '🕒',
  confirmed: '✅',
  preparing: '👨‍🍳',
  ready: '🍝',
  delivering: '🚚',
  delivered: '✅',
  cancelled: '❌'
};

export const PaymentStatusDisplay: Record<PaymentStatus, string> = {
  pending: 'Pendente',
  processing: 'Processando',
  paid: 'Pago',
  failed: 'Falhou',
  refunded: 'Reembolsado',
  cancelled: 'Cancelado'
};

export const PaymentMethodDisplay: Record<PaymentMethod, string> = {
  money: 'Dinheiro',
  debit: 'Cartão de Débito',
  credit: 'Cartão de Crédito',
  pix: 'PIX',
  online: 'Pagamento Online'
};

