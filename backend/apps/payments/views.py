"""
Views para pagamentos.
João Macarrão - Sistema de Pagamentos
"""
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.utils.decorators import method_decorator

from apps.core.models import Order
from .models import Payment, PaymentWebhook
from .serializers import (
    PaymentSerializer,
    PaymentCreateSerializer,
    PixPaymentResponseSerializer,
    StripePaymentResponseSerializer,
    MercadoPagoPaymentResponseSerializer,
    PaymentConfirmSerializer
)
from .services import (
    PaymentService,
    StripePaymentService,
    MercadoPagoPaymentService,
    PixPaymentService
)


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para visualização de pagamentos.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer
    
    def get_queryset(self):
        """
        Usuários veem apenas seus pagamentos.
        Staff vê todos.
        """
        user = self.request.user
        
        if user.is_staff:
            return Payment.objects.all().select_related('order', 'user')
        
        return Payment.objects.filter(user=user).select_related('order', 'user')
    
    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        """
        Verifica status de um pagamento.
        GET /api/payments/{id}/status/
        """
        payment = self.get_object()
        
        # Se for PIX, verifica com o provedor
        if payment.payment_method == 'pix' and payment.status == 'processing':
            pix_service = PixPaymentService()
            try:
                status_info = pix_service.verify_payment(payment.id)
                payment.refresh_from_db()
            except Exception as e:
                pass
        
        serializer = self.get_serializer(payment)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment(request):
    """
    Cria um novo pagamento para um pedido.
    
    POST /api/payments/create/
    Body:
    {
        "order_id": 1,
        "payment_method": "pix" | "credit_card" | "debit_card" | "cash"
    }
    """
    serializer = PaymentCreateSerializer(
        data=request.data,
        context={'request': request}
    )
    
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    order_id = serializer.validated_data['order_id']
    payment_method = serializer.validated_data['payment_method']
    
    try:
        # Busca pedido
        order = Order.objects.get(id=order_id)
        
        # Cria payment
        payment = PaymentService.create_payment(
            order=order,
            payment_method=payment_method,
            user=request.user
        )
        
        # Processa baseado no método
        if payment_method == 'pix':
            # PIX via Mercado Pago ou simulado
            pix_service = PixPaymentService()
            result = pix_service.create_pix_payment(payment)
            
            return Response({
                'success': True,
                'payment_method': 'pix',
                'data': result
            }, status=status.HTTP_201_CREATED)
        
        elif payment_method in ['credit_card', 'debit_card']:
            # Cartão via Stripe
            stripe_service = StripePaymentService()
            result = stripe_service.create_payment_intent(payment)
            
            return Response({
                'success': True,
                'payment_method': payment_method,
                'data': result
            }, status=status.HTTP_201_CREATED)
        
        elif payment_method == 'cash':
            # Pagamento em dinheiro - apenas cria o registro
            payment.status = 'pending'
            payment.save()
            
            return Response({
                'success': True,
                'payment_method': 'cash',
                'data': {
                    'payment_id': payment.id,
                    'message': 'Pagamento em dinheiro será realizado na entrega'
                }
            }, status=status.HTTP_201_CREATED)
        
        else:
            return Response({
                'error': 'Método de pagamento não suportado'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    except Order.DoesNotExist:
        return Response({
            'error': 'Pedido não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_payment(request):
    """
    Confirma um pagamento (manual ou após callback do gateway).
    
    POST /api/payments/confirm/
    Body:
    {
        "payment_id": 1,
        "transaction_id": "optional_transaction_id"
    }
    """
    serializer = PaymentConfirmSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    payment_id = serializer.validated_data['payment_id']
    transaction_id = serializer.validated_data.get('transaction_id')
    
    try:
        payment = Payment.objects.get(id=payment_id)
        
        # Verifica permissão
        if payment.user != request.user and not request.user.is_staff:
            return Response({
                'error': 'Você não tem permissão para confirmar este pagamento'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Atualiza transaction_id se fornecido
        if transaction_id:
            payment.transaction_id = transaction_id
        
        # Marca como completo
        payment.mark_as_completed()
        
        return Response({
            'success': True,
            'message': 'Pagamento confirmado com sucesso',
            'payment': PaymentSerializer(payment).data
        })
    
    except Payment.DoesNotExist:
        return Response({
            'error': 'Pagamento não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['POST'])
def stripe_webhook(request):
    """
    Webhook do Stripe para notificações de pagamento.
    
    POST /api/payments/webhook/stripe/
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    # Registra webhook
    PaymentWebhook.objects.create(
        provider='stripe',
        event_type='webhook',
        payload=request.data
    )
    
    try:
        stripe_service = StripePaymentService()
        stripe_service.handle_webhook(payload, sig_header)
        
        return HttpResponse(status=200)
    
    except Exception as e:
        return HttpResponse(status=400)


@csrf_exempt
@api_view(['POST'])
def mercadopago_webhook(request):
    """
    Webhook do Mercado Pago para notificações de pagamento.
    
    POST /api/payments/webhook/mercadopago/
    """
    # Registra webhook
    PaymentWebhook.objects.create(
        provider='mercadopago',
        event_type=request.data.get('type', 'unknown'),
        payload=request.data
    )
    
    try:
        mp_service = MercadoPagoPaymentService()
        mp_service.handle_webhook(request.data)
        
        return HttpResponse(status=200)
    
    except Exception as e:
        return HttpResponse(status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_history(request):
    """
    Lista histórico de pagamentos do usuário.
    
    GET /api/payments/history/
    """
    user = request.user
    
    if user.is_staff:
        payments = Payment.objects.all().select_related('order', 'user')
    else:
        payments = Payment.objects.filter(user=user).select_related('order', 'user')
    
    # Filtra por status se fornecido
    status_filter = request.query_params.get('status')
    if status_filter:
        payments = payments.filter(status=status_filter)
    
    # Ordena por data de criação (mais recente primeiro)
    payments = payments.order_by('-created_at')
    
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)
