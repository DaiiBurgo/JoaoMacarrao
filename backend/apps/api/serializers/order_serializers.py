"""
Serializers para pedidos.
João Macarrão - Sistema de Pedidos
"""
from rest_framework import serializers
from apps.core.models import Order, OrderItem, Dish
from decimal import Decimal


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer para Item do Pedido.
    """
    dish_name = serializers.CharField(source='dish.name', read_only=True)
    dish_id = serializers.PrimaryKeyRelatedField(
        queryset=Dish.objects.all(),
        source='dish',
        write_only=True
    )
    
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'dish_id',
            'dish_name',
            'quantity',
            'unit_price',
            'subtotal',
            'notes'
        ]
        read_only_fields = ['id', 'unit_price', 'subtotal']
    
    def validate_quantity(self, value):
        """Valida quantidade"""
        if value <= 0:
            raise serializers.ValidationError(
                "Quantidade deve ser maior que zero."
            )
        return value


class OrderItemCreateSerializer(serializers.Serializer):
    """
    Serializer simplificado para criação de itens.
    """
    dish_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate_dish_id(self, value):
        """Valida se o prato existe e está disponível"""
        try:
            dish = Dish.objects.get(id=value)
            if not dish.available:
                raise serializers.ValidationError(
                    f"O prato '{dish.name}' não está disponível."
                )
            if dish.stock <= 0:
                raise serializers.ValidationError(
                    f"O prato '{dish.name}' está sem estoque."
                )
            return value
        except Dish.DoesNotExist:
            raise serializers.ValidationError(
                "Prato não encontrado."
            )


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer completo para Pedido.
    """
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    items_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'user_name',
            'user_email',
            'status',
            'status_display',
            'payment_method',
            'payment_method_display',
            'delivery_address',
            'delivery_city',
            'delivery_zip_code',
            'subtotal',
            'delivery_fee',
            'total',
            'notes',
            'items',
            'items_count',
            'created_at',
            'updated_at',
            'confirmed_at',
            'delivered_at'
        ]
        read_only_fields = [
            'id',
            'user',
            'subtotal',
            'total',
            'created_at',
            'updated_at',
            'confirmed_at',
            'delivered_at'
        ]


class OrderCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para criação de pedidos.
    """
    items = OrderItemCreateSerializer(many=True, write_only=True)
    
    class Meta:
        model = Order
        fields = [
            'payment_method',
            'delivery_address',
            'delivery_city',
            'delivery_zip_code',
            'delivery_fee',
            'notes',
            'items'
        ]
    
    def validate_items(self, value):
        """Valida se há itens no pedido"""
        if not value:
            raise serializers.ValidationError(
                "O pedido deve ter pelo menos um item."
            )
        return value
    
    def validate_delivery_fee(self, value):
        """Valida taxa de entrega"""
        if value < 0:
            raise serializers.ValidationError(
                "Taxa de entrega não pode ser negativa."
            )
        return value
    
    def create(self, validated_data):
        """Cria pedido com seus itens"""
        items_data = validated_data.pop('items')
        
        # Cria o pedido
        order = Order.objects.create(**validated_data)
        
        # Cria os itens
        subtotal = Decimal('0.00')
        for item_data in items_data:
            dish = Dish.objects.get(id=item_data['dish_id'])
            
            # Verifica estoque
            if dish.stock < item_data['quantity']:
                order.delete()
                raise serializers.ValidationError({
                    'items': f"Estoque insuficiente para {dish.name}. Disponível: {dish.stock}"
                })
            
            # Cria item do pedido
            order_item = OrderItem.objects.create(
                order=order,
                dish=dish,
                quantity=item_data['quantity'],
                unit_price=dish.price,
                notes=item_data.get('notes', '')
            )
            
            subtotal += order_item.subtotal
            
            # Atualiza estoque
            dish.stock -= item_data['quantity']
            dish.save()
        
        # Atualiza totais do pedido
        order.subtotal = subtotal
        order.total = subtotal + order.delivery_fee
        order.save()
        
        return order


class OrderListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listagem de pedidos.
    """
    user_name = serializers.CharField(source='user.username', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    items_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = [
            'id',
            'user_name',
            'status',
            'status_display',
            'total',
            'items_count',
            'created_at'
        ]


class OrderStatusUpdateSerializer(serializers.Serializer):
    """
    Serializer para atualização de status do pedido.
    """
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)
    
    def validate_status(self, value):
        """Valida transições de status"""
        order = self.context.get('order')
        if not order:
            return value
        
        # Lógica de validação de transições
        valid_transitions = {
            'pending': ['confirmed', 'cancelled'],
            'confirmed': ['preparing', 'cancelled'],
            'preparing': ['ready', 'cancelled'],
            'ready': ['delivering'],
            'delivering': ['delivered'],
            'delivered': [],
            'cancelled': []
        }
        
        if value not in valid_transitions.get(order.status, []):
            raise serializers.ValidationError(
                f"Não é possível mudar de '{order.get_status_display()}' para '{dict(Order.STATUS_CHOICES)[value]}'"
            )
        
        return value


