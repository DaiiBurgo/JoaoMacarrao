"""
URLs para cardápio (categorias e pratos).
João Macarrão - Sistema de Cardápio
"""
from rest_framework.routers import DefaultRouter
from django.urls import path, include

from ..views.menu_views import CategoryViewSet, DishViewSet

app_name = 'menu'

# Router para ViewSets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'dishes', DishViewSet, basename='dish')

urlpatterns = [
    path('', include(router.urls)),
]


