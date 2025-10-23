"""
URLs principais para a API do João Macarrão
"""
from django.urls import path, include
from apps.api import views
from apps.api.views.admin_views import admin_stats, admin_dashboard_summary

app_name = 'api'

urlpatterns = [
    # Health check endpoint
    path('health/', views.health_check, name='health_check'),
    
    # Autenticação e usuários
    path('auth/', include('apps.api.urls.auth_urls')),
    
    # Cardápio (categorias e pratos)
    path('menu/', include('apps.api.urls.menu_urls')),
    
    # Pedidos
    path('orders/', include('apps.api.urls.order_urls')),
    
    # Admin endpoints
    path('admin/stats/', admin_stats, name='admin_stats'),
    path('admin/dashboard/', admin_dashboard_summary, name='admin_dashboard'),
]
