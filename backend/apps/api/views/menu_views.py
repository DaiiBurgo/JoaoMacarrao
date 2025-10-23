"""
Views para cardápio (categorias e pratos).
João Macarrão - Sistema de Cardápio
"""
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from apps.core.models import Category, Dish
from ..serializers.menu_serializers import (
    CategorySerializer,
    DishSerializer,
    DishListSerializer
)
from ..permissions import IsAtendenteOrAdminOrReadOnly


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet para CRUD completo de Categorias.
    
    Listagem e detalhes: público (AllowAny)
    Create/Update/Delete: apenas atendentes e admins
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAtendenteOrAdminOrReadOnly]
    lookup_field = 'slug'
    
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    @action(detail=True, methods=['get'])
    def dishes(self, request, slug=None):
        """
        Endpoint customizado: retorna todos os pratos de uma categoria.
        GET /api/menu/categories/{slug}/dishes/
        """
        category = self.get_object()
        dishes = category.dishes.filter(available=True)
        serializer = DishListSerializer(dishes, many=True)
        return Response({
            'category': category.name,
            'count': dishes.count(),
            'dishes': serializer.data
        })


class DishViewSet(viewsets.ModelViewSet):
    """
    ViewSet para CRUD completo de Pratos.
    
    Listagem e detalhes: público (AllowAny)
    Create/Update/Delete: apenas atendentes e admins
    
    Filtros disponíveis:
    - category: ID da categoria
    - available: true/false
    - vegetarian: true/false
    
    Busca disponível em:
    - name
    - description
    """
    queryset = Dish.objects.all().select_related('category')
    permission_classes = [IsAtendenteOrAdminOrReadOnly]
    lookup_field = 'slug'
    
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['category', 'available', 'vegetarian']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['category', 'name']
    
    def get_serializer_class(self):
        """
        Usa serializer simplificado para listagem.
        Serializer completo para detalhes e write operations.
        """
        if self.action == 'list':
            return DishListSerializer
        return DishSerializer
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """
        Endpoint customizado: retorna apenas pratos disponíveis.
        GET /api/menu/dishes/available/
        """
        dishes = self.queryset.filter(available=True, stock__gt=0)
        
        # Aplica filtros e busca
        dishes = self.filter_queryset(dishes)
        
        page = self.paginate_queryset(dishes)
        if page is not None:
            serializer = DishListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = DishListSerializer(dishes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def vegetarian(self, request):
        """
        Endpoint customizado: retorna apenas pratos vegetarianos.
        GET /api/menu/dishes/vegetarian/
        """
        dishes = self.queryset.filter(vegetarian=True, available=True)
        
        # Aplica filtros e busca
        dishes = self.filter_queryset(dishes)
        
        page = self.paginate_queryset(dishes)
        if page is not None:
            serializer = DishListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = DishListSerializer(dishes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_stock(self, request, slug=None):
        """
        Endpoint customizado: atualiza estoque de um prato.
        PATCH /api/menu/dishes/{slug}/update_stock/
        Body: {"stock": 10}
        """
        dish = self.get_object()
        stock = request.data.get('stock')
        
        if stock is None:
            return Response(
                {'error': 'Campo "stock" é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            stock = int(stock)
            if stock < 0:
                raise ValueError
        except (ValueError, TypeError):
            return Response(
                {'error': 'Estoque deve ser um número inteiro não-negativo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        dish.stock = stock
        dish.save()
        
        serializer = self.get_serializer(dish)
        return Response({
            'message': 'Estoque atualizado com sucesso',
            'dish': serializer.data
        })


