"""
Modelos de pagamento para João Macarrão.
Sistema de pagamento com múltiplos métodos (Pix, Stripe, Mercado Pago).
"""
from django.db import models
from django.conf import settings
from apps.core.models import Order
from decimal import Decimal


class Payment(models.Model):
    """
    Modelo de Pagamento.
    Registra todas as transações de pagamento.
    """
    
    PAYMENT_METHOD_CHOICES = [
        ('pix', 'PIX'),
        ('credit_card', 'Cartão de Crédito'),
        ('debit_card', 'Cartão de Débito'),
        ('cash', 'Dinheiro'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('processing', 'Processando'),
        ('completed', 'Completo'),
        ('failed', 'Falhou'),
        ('refunded', 'Reembolsado'),
        ('cancelled', 'Cancelado'),
    ]
    
    PAYMENT_PROVIDER_CHOICES = [
        ('stripe', 'Stripe'),
        ('mercadopago', 'Mercado Pago'),
        ('manual', 'Manual'),
    ]
    
    # Relacionamentos
    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name='payment',
        verbose_name='Pedido'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payments',
        verbose_name='Usuário'
    )
    
    # Dados do pagamento
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        verbose_name='Método de Pagamento'
    )
    payment_provider = models.CharField(
        max_length=20,
        choices=PAYMENT_PROVIDER_CHOICES,
        default='manual',
        verbose_name='Provedor de Pagamento'
    )
    status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending',
        verbose_name='Status'
    )
    
    # Valores
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Valor'
    )
    
    # IDs externos
    transaction_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name='ID da Transação',
        help_text='ID da transação no gateway de pagamento'
    )
    payment_intent_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name='Payment Intent ID',
        help_text='ID do Payment Intent (Stripe)'
    )
    preference_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name='Preference ID',
        help_text='ID da preferência (Mercado Pago)'
    )
    
    # Dados Pix
    pix_qr_code = models.TextField(
        blank=True,
        null=True,
        verbose_name='QR Code PIX',
        help_text='Código do QR Code PIX para pagamento'
    )
    pix_qr_code_url = models.URLField(
        blank=True,
        null=True,
        verbose_name='URL QR Code PIX'
    )
    pix_copy_paste = models.TextField(
        blank=True,
        null=True,
        verbose_name='PIX Copia e Cola'
    )
    
    # Metadata
    metadata = models.JSONField(
        default=dict,
        blank=True,
        verbose_name='Metadados',
        help_text='Dados adicionais do pagamento'
    )
    
    # Mensagens de erro
    error_message = models.TextField(
        blank=True,
        null=True,
        verbose_name='Mensagem de Erro'
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Criado em'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Atualizado em'
    )
    completed_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Completado em'
    )
    
    class Meta:
        verbose_name = 'Pagamento'
        verbose_name_plural = 'Pagamentos'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Pagamento #{self.id} - Pedido #{self.order.id} - {self.get_status_display()}"
    
    def mark_as_completed(self):
        """Marca pagamento como completo e atualiza pedido"""
        from django.utils import timezone
        
        self.status = 'completed'
        self.completed_at = timezone.now()
        self.save()
        
        # Atualiza status do pagamento no pedido
        self.order.payment_status = 'paid'
        self.order.save()
    
    def mark_as_failed(self, error_message=None):
        """Marca pagamento como falho"""
        self.status = 'failed'
        if error_message:
            self.error_message = error_message
        self.save()
        
        # Atualiza status do pagamento no pedido
        self.order.payment_status = 'failed'
        self.order.save()


class PaymentWebhook(models.Model):
    """
    Modelo para registrar webhooks recebidos dos gateways de pagamento.
    Útil para debug e auditoria.
    """
    
    provider = models.CharField(
        max_length=50,
        verbose_name='Provedor'
    )
    event_type = models.CharField(
        max_length=100,
        verbose_name='Tipo de Evento'
    )
    payload = models.JSONField(
        verbose_name='Dados do Webhook'
    )
    processed = models.BooleanField(
        default=False,
        verbose_name='Processado'
    )
    payment = models.ForeignKey(
        Payment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='webhooks',
        verbose_name='Pagamento'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Recebido em'
    )
    
    class Meta:
        verbose_name = 'Webhook de Pagamento'
        verbose_name_plural = 'Webhooks de Pagamento'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.provider} - {self.event_type} - {self.created_at}"
