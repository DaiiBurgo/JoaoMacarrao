"""
Views administrativas.
João Macarrão - Painel Administrativo
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import timedelta

from apps.core.models import Order, Dish, User
from apps.payments.models import Payment
from apps.contact.models import ContactMessage
from apps.reviews.models import DishReview


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats(request):
    """
    Retorna estatísticas gerais para o painel administrativo.
    GET /api/admin/stats/
    """
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    # Estatísticas de Pedidos
    orders_total = Order.objects.count()
    orders_today = Order.objects.filter(created_at__date=today).count()
    orders_week = Order.objects.filter(created_at__date__gte=week_ago).count()
    orders_pending = Order.objects.filter(status='pending').count()
    orders_in_progress = Order.objects.filter(
        status__in=['confirmed', 'preparing', 'ready', 'delivering']
    ).count()
    
    # Estatísticas de Vendas
    sales_stats = Order.objects.filter(
        payment_status='paid'
    ).aggregate(
        total=Sum('total'),
        count=Count('id'),
        average=Avg('total')
    )
    
    sales_today = Order.objects.filter(
        payment_status='paid',
        created_at__date=today
    ).aggregate(total=Sum('total'))
    
    sales_week = Order.objects.filter(
        payment_status='paid',
        created_at__date__gte=week_ago
    ).aggregate(total=Sum('total'))
    
    sales_month = Order.objects.filter(
        payment_status='paid',
        created_at__date__gte=month_ago
    ).aggregate(total=Sum('total'))
    
    # Estatísticas de Pagamentos
    payments_completed = Payment.objects.filter(status='completed').count()
    payments_pending = Payment.objects.filter(status='pending').count()
    payments_failed = Payment.objects.filter(status='failed').count()
    
    # Estatísticas de Usuários
    users_total = User.objects.count()
    users_clients = User.objects.filter(role='cliente').count()
    users_staff = User.objects.filter(Q(is_staff=True) | Q(role='atendente')).count()
    users_new_week = User.objects.filter(date_joined__gte=timezone.now() - timedelta(days=7)).count()
    
    # Estatísticas de Pratos
    dishes_total = Dish.objects.count()
    dishes_available = Dish.objects.filter(available=True).count()
    dishes_out_of_stock = Dish.objects.filter(stock=0).count()
    dishes_top_rated = Dish.objects.filter(
        average_rating__gt=0
    ).order_by('-average_rating')[:5].values('id', 'name', 'average_rating', 'reviews_count')
    
    # Estatísticas de Mensagens de Contato
    messages_total = ContactMessage.objects.count()
    messages_pending = ContactMessage.objects.filter(status='pending').count()
    messages_replied = ContactMessage.objects.filter(status='replied').count()
    messages_new_today = ContactMessage.objects.filter(created_at__date=today).count()
    
    # Estatísticas de Avaliações
    reviews_total = DishReview.objects.count()
    reviews_pending = DishReview.objects.filter(is_approved=False).count()
    reviews_average = DishReview.objects.filter(is_approved=True).aggregate(
        avg=Avg('rating')
    )
    reviews_new_week = DishReview.objects.filter(created_at__gte=timezone.now() - timedelta(days=7)).count()
    
    # Gráfico de pedidos por dia (últimos 7 dias)
    orders_by_day = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        count = Order.objects.filter(created_at__date=day).count()
        orders_by_day.append({
            'date': day.strftime('%Y-%m-%d'),
            'count': count
        })
    
    # Gráfico de vendas por dia (últimos 7 dias)
    sales_by_day = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        total = Order.objects.filter(
            created_at__date=day,
            payment_status='paid'
        ).aggregate(total=Sum('total'))
        sales_by_day.append({
            'date': day.strftime('%Y-%m-%d'),
            'total': float(total['total'] or 0)
        })
    
    return Response({
        'orders': {
            'total': orders_total,
            'today': orders_today,
            'week': orders_week,
            'pending': orders_pending,
            'in_progress': orders_in_progress
        },
        'sales': {
            'total': float(sales_stats['total'] or 0),
            'count': sales_stats['count'],
            'average': float(sales_stats['average'] or 0),
            'today': float(sales_today['total'] or 0),
            'week': float(sales_week['total'] or 0),
            'month': float(sales_month['total'] or 0)
        },
        'payments': {
            'completed': payments_completed,
            'pending': payments_pending,
            'failed': payments_failed
        },
        'users': {
            'total': users_total,
            'clients': users_clients,
            'staff': users_staff,
            'new_week': users_new_week
        },
        'dishes': {
            'total': dishes_total,
            'available': dishes_available,
            'out_of_stock': dishes_out_of_stock,
            'top_rated': list(dishes_top_rated)
        },
        'messages': {
            'total': messages_total,
            'pending': messages_pending,
            'replied': messages_replied,
            'new_today': messages_new_today
        },
        'reviews': {
            'total': reviews_total,
            'pending': reviews_pending,
            'average': round(reviews_average['avg'] or 0, 2),
            'new_week': reviews_new_week
        },
        'charts': {
            'orders_by_day': orders_by_day,
            'sales_by_day': sales_by_day
        }
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_summary(request):
    """
    Retorna resumo rápido para dashboard.
    GET /api/admin/dashboard/
    """
    pending_orders = Order.objects.filter(status='pending').count()
    pending_messages = ContactMessage.objects.filter(status='pending').count()
    pending_reviews = DishReview.objects.filter(is_approved=False).count()
    low_stock_dishes = Dish.objects.filter(stock__lte=5, available=True).count()
    
    recent_orders = Order.objects.select_related('user').order_by('-created_at')[:5].values(
        'id', 'user__username', 'total', 'status', 'created_at'
    )
    
    recent_messages = ContactMessage.objects.order_by('-created_at')[:5].values(
        'id', 'name', 'subject', 'status', 'created_at'
    )
    
    return Response({
        'alerts': {
            'pending_orders': pending_orders,
            'pending_messages': pending_messages,
            'pending_reviews': pending_reviews,
            'low_stock_dishes': low_stock_dishes
        },
        'recent_orders': list(recent_orders),
        'recent_messages': list(recent_messages)
    })

