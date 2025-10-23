"""
Serializers para pagamentos.
João Macarrão - Sistema de Pagamentos
"""
from rest_framework import serializers
from .models import Payment, PaymentWebhook


class PaymentSerializer(serializers.ModelSerializer):
    """
    Serializer para Payment.
    """
    order_id = serializers.IntegerField(source='order.id', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id',
            'order_id',
            'user_name',
            'payment_method',
            'payment_method_display',
            'payment_provider',
            'status',
            'status_display',
            'amount',
            'transaction_id',
            'payment_intent_id',
            'preference_id',
            'pix_qr_code',
            'pix_qr_code_url',
            'pix_copy_paste',
            'metadata',
            'error_message',
            'created_at',
            'updated_at',
            'completed_at'
        ]
        read_only_fields = [
            'id',
            'user_name',
            'status',
            'transaction_id',
            'payment_intent_id',
            'preference_id',
            'pix_qr_code',
            'pix_qr_code_url',
            'pix_copy_paste',
            'error_message',
            'created_at',
            'updated_at',
            'completed_at'
        ]


class PaymentCreateSerializer(serializers.Serializer):
    """
    Serializer para criação de pagamento.
    """
    order_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(
        choices=Payment.PAYMENT_METHOD_CHOICES
    )
    
    def validate_order_id(self, value):
        """Valida se o pedido existe e pertence ao usuário"""
        from apps.core.models import Order
        
        try:
            order = Order.objects.get(id=value)
        except Order.DoesNotExist:
            raise serializers.ValidationError("Pedido não encontrado.")
        
        # Verifica se já existe pagamento para este pedido
        if hasattr(order, 'payment'):
            raise serializers.ValidationError(
                "Já existe um pagamento para este pedido."
            )
        
        # Verifica se o pedido pertence ao usuário
        user = self.context.get('request').user
        if order.user != user and not user.is_staff:
            raise serializers.ValidationError(
                "Você não tem permissão para criar pagamento para este pedido."
            )
        
        return value


class PixPaymentResponseSerializer(serializers.Serializer):
    """
    Serializer para resposta de pagamento PIX.
    """
    payment_id = serializers.IntegerField()
    qr_code = serializers.CharField()
    qr_code_url = serializers.URLField(required=False)
    copy_paste = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    expires_at = serializers.DateTimeField(required=False)


class StripePaymentResponseSerializer(serializers.Serializer):
    """
    Serializer para resposta de pagamento Stripe.
    """
    payment_id = serializers.IntegerField()
    client_secret = serializers.CharField()
    publishable_key = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)


class MercadoPagoPaymentResponseSerializer(serializers.Serializer):
    """
    Serializer para resposta de pagamento Mercado Pago.
    """
    payment_id = serializers.IntegerField()
    preference_id = serializers.CharField()
    init_point = serializers.URLField()
    sandbox_init_point = serializers.URLField(required=False)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)


class PaymentConfirmSerializer(serializers.Serializer):
    """
    Serializer para confirmação de pagamento.
    """
    payment_id = serializers.IntegerField()
    transaction_id = serializers.CharField(required=False)
    
    def validate_payment_id(self, value):
        """Valida se o pagamento existe"""
        try:
            payment = Payment.objects.get(id=value)
        except Payment.DoesNotExist:
            raise serializers.ValidationError("Pagamento não encontrado.")
        
        return value


class WebhookSerializer(serializers.ModelSerializer):
    """
    Serializer para Webhook.
    """
    class Meta:
        model = PaymentWebhook
        fields = [
            'id',
            'provider',
            'event_type',
            'payload',
            'processed',
            'payment',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']

