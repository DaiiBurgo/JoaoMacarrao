"""
URLs para pagamentos.
João Macarrão - Sistema de Pagamentos
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'payments', views.PaymentViewSet, basename='payment')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Criar pagamento
    path('payments/create/', views.create_payment, name='payment-create'),
    
    # Confirmar pagamento
    path('payments/confirm/', views.confirm_payment, name='payment-confirm'),
    
    # Histórico de pagamentos
    path('payments/history/', views.payment_history, name='payment-history'),
    
    # Webhooks
    path('payments/webhook/stripe/', views.stripe_webhook, name='webhook-stripe'),
    path('payments/webhook/mercadopago/', views.mercadopago_webhook, name='webhook-mercadopago'),
]

