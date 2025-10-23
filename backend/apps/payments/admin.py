"""
Admin para pagamentos.
João Macarrão - Sistema de Pagamentos
"""
from django.contrib import admin
from .models import Payment, PaymentWebhook


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """
    Admin para Payment.
    """
    list_display = [
        'id',
        'order',
        'user',
        'payment_method',
        'payment_provider',
        'status',
        'amount',
        'created_at'
    ]
    list_filter = [
        'payment_method',
        'payment_provider',
        'status',
        'created_at'
    ]
    search_fields = [
        'order__id',
        'user__username',
        'user__email',
        'transaction_id',
        'payment_intent_id'
    ]
    readonly_fields = [
        'created_at',
        'updated_at',
        'completed_at'
    ]
    fieldsets = (
        ('Informações Básicas', {
            'fields': (
                'order',
                'user',
                'payment_method',
                'payment_provider',
                'status',
                'amount'
            )
        }),
        ('IDs de Transação', {
            'fields': (
                'transaction_id',
                'payment_intent_id',
                'preference_id'
            )
        }),
        ('Dados PIX', {
            'fields': (
                'pix_qr_code',
                'pix_qr_code_url',
                'pix_copy_paste'
            ),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': (
                'metadata',
                'error_message'
            ),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at',
                'completed_at'
            )
        })
    )


@admin.register(PaymentWebhook)
class PaymentWebhookAdmin(admin.ModelAdmin):
    """
    Admin para PaymentWebhook.
    """
    list_display = [
        'id',
        'provider',
        'event_type',
        'processed',
        'payment',
        'created_at'
    ]
    list_filter = [
        'provider',
        'event_type',
        'processed',
        'created_at'
    ]
    search_fields = [
        'provider',
        'event_type',
        'payment__id'
    ]
    readonly_fields = ['created_at']
