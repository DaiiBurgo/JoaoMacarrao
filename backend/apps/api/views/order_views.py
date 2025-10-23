"""
Views para pedidos.
João Macarrão - Sistema de Pedidos
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from apps.core.models import Order, OrderItem
from ..serializers.order_serializers import (
    OrderSerializer,
    OrderCreateSerializer,
    OrderListSerializer,
    OrderStatusUpdateSerializer
)
from ..permissions import IsAtendenteOrAdmin


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de pedidos.
    
    Clientes:
    - Podem criar pedidos
    - Podem ver apenas seus próprios pedidos
    
    Atendentes/Admins:
    - Podem ver todos os pedidos
    - Podem atualizar status dos pedidos
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['status', 'payment_method']
    search_fields = ['user__username', 'user__email', 'delivery_address']
    ordering_fields = ['created_at', 'total', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """
        Clientes veem apenas seus pedidos.
        Atendentes/Admins veem todos.
        """
        user = self.request.user
        
        if user.is_atendente() or user.is_admin():
            return Order.objects.all().prefetch_related('items__dish')
        
        return Order.objects.filter(user=user).prefetch_related('items__dish')
    
    def get_serializer_class(self):
        """Retorna serializer apropriado"""
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action == 'list':
            return OrderListSerializer
        return OrderSerializer
    
    def perform_create(self, serializer):
        """Associa pedido ao usuário autenticado"""
        serializer.save(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        """Bloqueia atualização completa do pedido"""
        return Response(
            {'error': 'Use o endpoint de atualização de status'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    def partial_update(self, request, *args, **kwargs):
        """Bloqueia atualização parcial do pedido"""
        return Response(
            {'error': 'Use o endpoint de atualização de status'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    def destroy(self, request, *args, **kwargs):
        """Bloqueia exclusão direta - deve-se cancelar"""
        return Response(
            {'error': 'Use o endpoint de cancelamento'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAtendenteOrAdmin])
    def update_status(self, request, pk=None):
        """
        Atualiza status do pedido (apenas atendentes/admins).
        PATCH /api/orders/{id}/update_status/
        Body: {"status": "confirmed"}
        """
        order = self.get_object()
        serializer = OrderStatusUpdateSerializer(
            data=request.data,
            context={'order': order}
        )
        
        if serializer.is_valid():
            new_status = serializer.validated_data['status']
            old_status = order.status
            
            order.status = new_status
            
            # Atualiza timestamps específicos
            if new_status == 'confirmed' and not order.confirmed_at:
                order.confirmed_at = timezone.now()
            elif new_status == 'delivered':
                order.delivered_at = timezone.now()
            
            order.save()
            
            return Response({
                'message': f'Status atualizado de "{order.get_status_display()}" para "{order.get_status_display()}"',
                'order': OrderSerializer(order).data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        Cancela um pedido.
        POST /api/orders/{id}/cancel/
        
        Clientes: podem cancelar seus próprios pedidos
        Atendentes/Admins: podem cancelar qualquer pedido
        """
        order = self.get_object()
        
        # Verifica permissão
        if not (request.user == order.user or request.user.is_atendente() or request.user.is_admin()):
            return Response(
                {'error': 'Você não tem permissão para cancelar este pedido'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verifica se pode ser cancelado
        if not order.can_be_cancelled():
            return Response(
                {'error': f'Pedidos com status "{order.get_status_display()}" não podem ser cancelados'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Devolve estoque
        for item in order.items.all():
            item.dish.stock += item.quantity
            item.dish.save()
        
        # Cancela pedido
        order.status = 'cancelled'
        order.save()
        
        return Response({
            'message': 'Pedido cancelado com sucesso',
            'order': OrderSerializer(order).data
        })
    
    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """
        Lista pedidos do usuário autenticado.
        GET /api/orders/my_orders/
        """
        orders = Order.objects.filter(user=request.user).prefetch_related('items__dish')
        
        # Aplica filtros
        orders = self.filter_queryset(orders)
        
        page = self.paginate_queryset(orders)
        if page is not None:
            serializer = OrderListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAtendenteOrAdmin])
    def pending(self, request):
        """
        Lista pedidos pendentes (apenas atendentes/admins).
        GET /api/orders/pending/
        """
        orders = Order.objects.filter(status='pending').prefetch_related('items__dish')
        
        page = self.paginate_queryset(orders)
        if page is not None:
            serializer = OrderListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAtendenteOrAdmin])
    def in_progress(self, request):
        """
        Lista pedidos em andamento (apenas atendentes/admins).
        GET /api/orders/in_progress/
        """
        orders = Order.objects.filter(
            status__in=['confirmed', 'preparing', 'ready', 'delivering']
        ).prefetch_related('items__dish')
        
        page = self.paginate_queryset(orders)
        if page is not None:
            serializer = OrderListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)


