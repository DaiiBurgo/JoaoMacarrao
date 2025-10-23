"""
Views para reviews.
João Macarrão - Sistema de Avaliações
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.db.models import Avg, Count

from .models import DishReview, ReviewHelpful
from .serializers import (
    DishReviewSerializer,
    DishReviewCreateSerializer,
    DishReviewUpdateSerializer,
    DishReviewListSerializer,
    DishWithReviewsSerializer
)
from apps.core.models import Dish


class DishReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de avaliações de pratos.
    
    - POST (autenticado): Criar avaliação
    - GET (público): Listar avaliações
    - PUT/PATCH (próprio usuário): Atualizar avaliação
    - DELETE (próprio usuário ou admin): Deletar avaliação
    """
    
    def get_permissions(self):
        """
        Permissões personalizadas.
        - list, retrieve: Público
        - create: Autenticado
        - update, destroy: Próprio usuário ou admin
        """
        if self.action in ['list', 'retrieve', 'dish_reviews', 'dish_stats']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """
        Filtra avaliações.
        - Público: Apenas aprovadas
        - Admin: Todas
        """
        user = self.request.user
        
        if user.is_staff:
            return DishReview.objects.all().select_related('user', 'dish')
        
        return DishReview.objects.filter(is_approved=True).select_related('user', 'dish')
    
    def get_serializer_class(self):
        """Retorna serializer apropriado"""
        if self.action == 'create':
            return DishReviewCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return DishReviewUpdateSerializer
        elif self.action == 'list':
            return DishReviewListSerializer
        return DishReviewSerializer
    
    def perform_create(self, serializer):
        """Associa avaliação ao usuário autenticado"""
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        """Verifica permissão para atualizar"""
        review = self.get_object()
        if review.user != self.request.user and not self.request.user.is_staff:
            raise PermissionError("Você não pode editar esta avaliação.")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Verifica permissão para deletar"""
        if instance.user != self.request.user and not self.request.user.is_staff:
            raise PermissionError("Você não pode deletar esta avaliação.")
        instance.delete()
    
    @action(detail=False, methods=['get'], url_path='dish/(?P<dish_id>[^/.]+)')
    def dish_reviews(self, request, dish_id=None):
        """
        Lista avaliações de um prato específico.
        GET /api/reviews/dish/{dish_id}/
        """
        try:
            dish = Dish.objects.get(id=dish_id)
        except Dish.DoesNotExist:
            return Response({
                'error': 'Prato não encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
        
        reviews = self.get_queryset().filter(dish=dish)
        
        # Ordenação
        ordering = request.query_params.get('ordering', '-created_at')
        if ordering == 'helpful':
            reviews = reviews.order_by('-helpful_count', '-created_at')
        elif ordering == 'rating_high':
            reviews = reviews.order_by('-rating', '-created_at')
        elif ordering == 'rating_low':
            reviews = reviews.order_by('rating', '-created_at')
        else:
            reviews = reviews.order_by('-created_at')
        
        page = self.paginate_queryset(reviews)
        if page is not None:
            serializer = DishReviewListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = DishReviewListSerializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='dish/(?P<dish_id>[^/.]+)/stats')
    def dish_stats(self, request, dish_id=None):
        """
        Retorna estatísticas de avaliações de um prato.
        GET /api/reviews/dish/{dish_id}/stats/
        """
        try:
            dish = Dish.objects.get(id=dish_id)
        except Dish.DoesNotExist:
            return Response({
                'error': 'Prato não encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
        
        reviews = self.get_queryset().filter(dish=dish)
        
        # Estatísticas
        stats = reviews.aggregate(
            average=Avg('rating'),
            count=Count('id')
        )
        
        # Distribuição por estrelas
        distribution = {}
        for i in range(1, 6):
            distribution[f'stars_{i}'] = reviews.filter(rating=i).count()
        
        return Response({
            'dish_id': dish.id,
            'dish_name': dish.name,
            'average_rating': round(stats['average'] or 0, 2),
            'total_reviews': stats['count'],
            'distribution': distribution
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_helpful(self, request, pk=None):
        """
        Marca avaliação como útil.
        POST /api/reviews/{id}/mark_helpful/
        """
        review = self.get_object()
        user = request.user
        
        # Verifica se já marcou
        existing = ReviewHelpful.objects.filter(review=review, user=user).first()
        
        if existing:
            # Remove marcação
            existing.delete()
            review.helpful_count = max(0, review.helpful_count - 1)
            review.save(update_fields=['helpful_count'])
            
            return Response({
                'success': True,
                'message': 'Marcação removida',
                'helpful_count': review.helpful_count,
                'is_helpful': False
            })
        else:
            # Adiciona marcação
            ReviewHelpful.objects.create(review=review, user=user)
            review.helpful_count += 1
            review.save(update_fields=['helpful_count'])
            
            return Response({
                'success': True,
                'message': 'Avaliação marcada como útil',
                'helpful_count': review.helpful_count,
                'is_helpful': True
            })
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_reviews(self, request):
        """
        Lista avaliações do usuário autenticado.
        GET /api/reviews/my_reviews/
        """
        reviews = DishReview.objects.filter(user=request.user).select_related('dish')
        
        page = self.paginate_queryset(reviews)
        if page is not None:
            serializer = DishReviewSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = DishReviewSerializer(reviews, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def approve(self, request, pk=None):
        """
        Aprova uma avaliação (admin apenas).
        PATCH /api/reviews/{id}/approve/
        """
        review = self.get_object()
        review.is_approved = True
        review.save()
        
        return Response({
            'success': True,
            'message': 'Avaliação aprovada',
            'data': DishReviewSerializer(review).data
        })
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def reject(self, request, pk=None):
        """
        Rejeita uma avaliação (admin apenas).
        PATCH /api/reviews/{id}/reject/
        """
        review = self.get_object()
        review.is_approved = False
        review.save()
        
        return Response({
            'success': True,
            'message': 'Avaliação rejeitada',
            'data': DishReviewSerializer(review).data
        })

