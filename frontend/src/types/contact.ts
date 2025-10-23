/**
 * Tipos TypeScript para sistema de contato
 * João Macarrão - Sistema de Contato
 */

export type ContactMessageStatus = 'pending' | 'read' | 'replied' | 'archived';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  user?: number;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  status_display?: string;
  response?: string;
  responded_by?: number;
  responded_by_name?: string;
  responded_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessageCreateData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessageResponse {
  success: boolean;
  message: string;
  data: ContactMessage;
}

export const ContactStatusDisplay: Record<ContactMessageStatus, string> = {
  pending: 'Pendente',
  read: 'Lida',
  replied: 'Respondida',
  archived: 'Arquivada'
};

