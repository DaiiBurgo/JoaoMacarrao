/**
 * Tipos TypeScript para sistema de pagamentos
 * João Macarrão - Sistema de Pagamentos
 */

export type PaymentMethodType = 'pix' | 'credit_card' | 'debit_card' | 'cash';

export type PaymentStatusType = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export type PaymentProvider = 'stripe' | 'mercadopago' | 'manual';

export interface Payment {
  id: number;
  order_id: number;
  user_name?: string;
  payment_method: PaymentMethodType;
  payment_method_display?: string;
  payment_provider: PaymentProvider;
  status: PaymentStatusType;
  status_display?: string;
  amount: number;
  transaction_id?: string;
  payment_intent_id?: string;
  preference_id?: string;
  pix_qr_code?: string;
  pix_qr_code_url?: string;
  pix_copy_paste?: string;
  metadata: Record<string, any>;
  error_message?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface PaymentCreateData {
  order_id: number;
  payment_method: PaymentMethodType;
}

export interface PixPaymentResponse {
  payment_id: number;
  qr_code: string;
  qr_code_url?: string;
  copy_paste: string;
  amount: number;
  expires_at?: string;
}

export interface StripePaymentResponse {
  payment_id: number;
  client_secret: string;
  publishable_key: string;
  amount: number;
}

export interface MercadoPagoPaymentResponse {
  payment_id: number;
  preference_id: string;
  init_point: string;
  sandbox_init_point?: string;
  amount: number;
}

export interface PaymentResponse {
  success: boolean;
  payment_method: PaymentMethodType;
  data: PixPaymentResponse | StripePaymentResponse | MercadoPagoPaymentResponse | any;
}

export interface PaymentConfirmData {
  payment_id: number;
  transaction_id?: string;
}

export const PaymentMethodIcons: Record<PaymentMethodType, string> = {
  pix: '📱',
  credit_card: '💳',
  debit_card: '💳',
  cash: '💵'
};

export const PaymentMethodNames: Record<PaymentMethodType, string> = {
  pix: 'PIX',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  cash: 'Dinheiro'
};

