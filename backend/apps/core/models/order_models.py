"""
Modelos de pedidos para João Macarrão.
Sistema completo de gerenciamento de pedidos.
"""
from django.db import models
from django.conf import settings
from decimal import Decimal


class Order(models.Model):
    """
    Modelo de Pedido.
    Representa um pedido feito por um cliente.
    """
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('confirmed', 'Confirmado'),
        ('preparing', 'Em Preparo'),
        ('ready', 'Pronto'),
        ('delivering', 'Em Entrega'),
        ('delivered', 'Entregue'),
        ('cancelled', 'Cancelado'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('money', 'Dinheiro'),
        ('debit', 'Cartão de Débito'),
        ('credit', 'Cartão de Crédito'),
        ('pix', 'PIX'),
        ('online', 'Pagamento Online'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('processing', 'Processando'),
        ('paid', 'Pago'),
        ('failed', 'Falhou'),
        ('refunded', 'Reembolsado'),
        ('cancelled', 'Cancelado'),
    ]
    
    # Relacionamentos
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name='Cliente'
    )
    
    # Dados do pedido
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Status'
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default='money',
        verbose_name='Forma de Pagamento'
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending',
        verbose_name='Status do Pagamento'
    )
    
    # Endereço de entrega
    delivery_address = models.TextField(
        verbose_name='Endereço de Entrega'
    )
    delivery_city = models.CharField(
        max_length=100,
        default='São Paulo',
        verbose_name='Cidade'
    )
    delivery_zip_code = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        verbose_name='CEP'
    )
    
    # Valores
    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name='Subtotal'
    )
    delivery_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('5.00'),
        verbose_name='Taxa de Entrega'
    )
    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name='Total'
    )
    
    # Observações
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name='Observações'
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
    confirmed_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Confirmado em'
    )
    delivered_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Entregue em'
    )
    
    class Meta:
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Pedido #{self.id} - {self.user.username} - {self.get_status_display()}"
    
    def calculate_total(self):
        """Calcula o total do pedido"""
        self.subtotal = sum(
            item.subtotal for item in self.items.all()
        )
        self.total = self.subtotal + self.delivery_fee
        self.save()
    
    @property
    def items_count(self):
        """Retorna quantidade total de itens"""
        return sum(item.quantity for item in self.items.all())
    
    def can_be_cancelled(self):
        """Verifica se o pedido pode ser cancelado"""
        return self.status in ['pending', 'confirmed']


class OrderItem(models.Model):
    """
    Modelo de Item do Pedido.
    Representa cada prato dentro de um pedido.
    """
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Pedido'
    )
    dish = models.ForeignKey(
        'core.Dish',
        on_delete=models.PROTECT,
        related_name='order_items',
        verbose_name='Prato'
    )
    quantity = models.PositiveIntegerField(
        default=1,
        verbose_name='Quantidade'
    )
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Preço Unitário'
    )
    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Subtotal'
    )
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name='Observações do Item'
    )
    
    class Meta:
        verbose_name = 'Item do Pedido'
        verbose_name_plural = 'Itens do Pedido'
    
    def __str__(self):
        return f"{self.quantity}x {self.dish.name}"
    
    def save(self, *args, **kwargs):
        """Calcula subtotal automaticamente"""
        self.subtotal = self.unit_price * self.quantity
        super().save(*args, **kwargs)


