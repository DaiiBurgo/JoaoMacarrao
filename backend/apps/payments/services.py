"""
Serviços de pagamento para João Macarrão.
Integração com Stripe, Mercado Pago e PIX.
"""
import stripe
import mercadopago
import qrcode
import io
import base64
from decimal import Decimal
from django.conf import settings
from .models import Payment


class PaymentService:
    """
    Serviço base para pagamentos.
    """
    
    @staticmethod
    def create_payment(order, payment_method, user):
        """
        Cria um registro de pagamento.
        """
        # Determina o provedor baseado no método
        if payment_method == 'pix':
            provider = 'mercadopago'  # ou outro provedor de PIX
        elif payment_method in ['credit_card', 'debit_card']:
            provider = 'stripe'
        else:
            provider = 'manual'
        
        payment = Payment.objects.create(
            order=order,
            user=user,
            payment_method=payment_method,
            payment_provider=provider,
            amount=order.total,
            status='pending'
        )
        
        return payment


class StripePaymentService:
    """
    Serviço de pagamento via Stripe.
    """
    
    def __init__(self):
        self.stripe_key = getattr(settings, 'STRIPE_SECRET_KEY', None)
        if self.stripe_key:
            stripe.api_key = self.stripe_key
    
    def create_payment_intent(self, payment):
        """
        Cria um Payment Intent no Stripe.
        """
        try:
            if not self.stripe_key:
                raise Exception("Stripe não configurado. Defina STRIPE_SECRET_KEY nas configurações.")
            
            # Converte valor para centavos
            amount_cents = int(payment.amount * 100)
            
            # Cria Payment Intent
            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency='brl',
                metadata={
                    'order_id': payment.order.id,
                    'payment_id': payment.id,
                    'user_id': payment.user.id
                },
                description=f'Pedido #{payment.order.id} - João Macarrão'
            )
            
            # Atualiza payment com dados do Stripe
            payment.payment_intent_id = intent.id
            payment.transaction_id = intent.id
            payment.status = 'processing'
            payment.metadata['stripe_intent'] = intent
            payment.save()
            
            return {
                'payment_id': payment.id,
                'client_secret': intent.client_secret,
                'publishable_key': getattr(settings, 'STRIPE_PUBLISHABLE_KEY', ''),
                'amount': payment.amount
            }
            
        except stripe.error.StripeError as e:
            payment.mark_as_failed(str(e))
            raise Exception(f"Erro ao criar pagamento Stripe: {str(e)}")
    
    def confirm_payment(self, payment_intent_id):
        """
        Confirma um pagamento no Stripe.
        """
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            
            if intent.status == 'succeeded':
                return True
            return False
            
        except stripe.error.StripeError as e:
            raise Exception(f"Erro ao confirmar pagamento: {str(e)}")
    
    def handle_webhook(self, payload, sig_header):
        """
        Processa webhook do Stripe.
        """
        try:
            webhook_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', None)
            
            if webhook_secret:
                event = stripe.Webhook.construct_event(
                    payload, sig_header, webhook_secret
                )
            else:
                # Se não tiver webhook secret, apenas decodifica o payload
                import json
                event = json.loads(payload)
            
            # Processa evento
            if event['type'] == 'payment_intent.succeeded':
                payment_intent = event['data']['object']
                payment_intent_id = payment_intent['id']
                
                # Busca pagamento
                try:
                    payment = Payment.objects.get(payment_intent_id=payment_intent_id)
                    payment.mark_as_completed()
                    return True
                except Payment.DoesNotExist:
                    pass
            
            elif event['type'] == 'payment_intent.payment_failed':
                payment_intent = event['data']['object']
                payment_intent_id = payment_intent['id']
                
                try:
                    payment = Payment.objects.get(payment_intent_id=payment_intent_id)
                    error_message = payment_intent.get('last_payment_error', {}).get('message', 'Pagamento falhou')
                    payment.mark_as_failed(error_message)
                except Payment.DoesNotExist:
                    pass
            
            return True
            
        except Exception as e:
            raise Exception(f"Erro ao processar webhook Stripe: {str(e)}")


class MercadoPagoPaymentService:
    """
    Serviço de pagamento via Mercado Pago (PIX e Cartão).
    """
    
    def __init__(self):
        self.access_token = getattr(settings, 'MERCADOPAGO_ACCESS_TOKEN', None)
        if self.access_token:
            self.sdk = mercadopago.SDK(self.access_token)
        else:
            self.sdk = None
    
    def create_pix_payment(self, payment):
        """
        Cria um pagamento PIX via Mercado Pago.
        """
        try:
            if not self.sdk:
                # Modo simulado para desenvolvimento
                return self._create_simulated_pix(payment)
            
            # Cria preferência de pagamento
            preference_data = {
                "items": [
                    {
                        "title": f"Pedido #{payment.order.id}",
                        "quantity": 1,
                        "unit_price": float(payment.amount),
                        "currency_id": "BRL"
                    }
                ],
                "payer": {
                    "email": payment.user.email,
                    "name": payment.user.get_full_name() or payment.user.username
                },
                "payment_methods": {
                    "excluded_payment_types": [
                        {"id": "credit_card"},
                        {"id": "debit_card"},
                        {"id": "ticket"}
                    ],
                    "installments": 1
                },
                "external_reference": str(payment.id),
                "notification_url": f"{getattr(settings, 'BACKEND_URL', '')}/api/payments/webhook/mercadopago/",
                "auto_return": "approved"
            }
            
            preference_response = self.sdk.preference().create(preference_data)
            preference = preference_response["response"]
            
            # Atualiza payment
            payment.preference_id = preference["id"]
            payment.status = 'processing'
            payment.metadata['preference'] = preference
            payment.save()
            
            return {
                'payment_id': payment.id,
                'preference_id': preference["id"],
                'init_point': preference["init_point"],
                'sandbox_init_point': preference.get("sandbox_init_point"),
                'amount': payment.amount
            }
            
        except Exception as e:
            payment.mark_as_failed(str(e))
            raise Exception(f"Erro ao criar pagamento PIX: {str(e)}")
    
    def _create_simulated_pix(self, payment):
        """
        Cria um pagamento PIX simulado para desenvolvimento.
        """
        # Gera QR Code simulado
        pix_code = f"00020126330014BR.GOV.BCB.PIX0111{payment.id:011d}5204000053039865802BR5925Joao Macarrao6009SAO PAULO62070503***6304"
        
        # Gera imagem do QR Code
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(pix_code)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        qr_code_base64 = base64.b64encode(buffer.getvalue()).decode()
        
        # Atualiza payment
        payment.pix_qr_code = qr_code_base64
        payment.pix_copy_paste = pix_code
        payment.status = 'processing'
        payment.save()
        
        return {
            'payment_id': payment.id,
            'qr_code': qr_code_base64,
            'copy_paste': pix_code,
            'amount': payment.amount
        }
    
    def handle_webhook(self, data):
        """
        Processa webhook do Mercado Pago.
        """
        try:
            # Mercado Pago envia notificações de diferentes tipos
            topic = data.get('topic') or data.get('type')
            
            if topic == 'payment':
                payment_id = data.get('data', {}).get('id') or data.get('id')
                
                if payment_id:
                    # Busca detalhes do pagamento
                    payment_info = self.sdk.payment().get(payment_id)
                    payment_data = payment_info["response"]
                    
                    # Busca nosso Payment pelo external_reference
                    external_ref = payment_data.get('external_reference')
                    if external_ref:
                        try:
                            payment = Payment.objects.get(id=int(external_ref))
                            
                            status = payment_data.get('status')
                            if status == 'approved':
                                payment.transaction_id = str(payment_id)
                                payment.mark_as_completed()
                            elif status == 'rejected':
                                payment.mark_as_failed('Pagamento rejeitado')
                            
                        except Payment.DoesNotExist:
                            pass
            
            return True
            
        except Exception as e:
            raise Exception(f"Erro ao processar webhook Mercado Pago: {str(e)}")


class PixPaymentService:
    """
    Serviço genérico de pagamento PIX.
    Pode usar diferentes provedores (Mercado Pago, PagBank, etc).
    """
    
    def __init__(self):
        # Por padrão, usa Mercado Pago
        self.provider = MercadoPagoPaymentService()
    
    def create_pix_payment(self, payment):
        """
        Cria pagamento PIX.
        """
        return self.provider.create_pix_payment(payment)
    
    def verify_payment(self, payment_id):
        """
        Verifica status de um pagamento PIX.
        """
        try:
            payment = Payment.objects.get(id=payment_id)
            
            # Implementar verificação real com o provedor
            # Por enquanto, retorna o status atual
            return {
                'payment_id': payment.id,
                'status': payment.status,
                'completed': payment.status == 'completed'
            }
            
        except Payment.DoesNotExist:
            raise Exception("Pagamento não encontrado")

