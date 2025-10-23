"""
URLs para reviews.
João Macarrão - Sistema de Avaliações
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DishReviewViewSet

router = DefaultRouter()
router.register(r'reviews', DishReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]

