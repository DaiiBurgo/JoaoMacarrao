"""
URLs para pedidos.
João Macarrão - Sistema de Pedidos
"""
from rest_framework.routers import DefaultRouter
from django.urls import path, include

from ..views.order_views import OrderViewSet

app_name = 'orders'

# Router para ViewSets
router = DefaultRouter()
router.register(r'', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]


