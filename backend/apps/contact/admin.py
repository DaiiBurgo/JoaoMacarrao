"""
Admin para contato.
João Macarrão - Sistema de Contato
"""
from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    """
    Admin para ContactMessage.
    """
    list_display = [
        'id',
        'name',
        'email',
        'subject',
        'status',
        'created_at'
    ]
    list_filter = [
        'status',
        'created_at'
    ]
    search_fields = [
        'name',
        'email',
        'subject',
        'message'
    ]
    readonly_fields = [
        'created_at',
        'updated_at',
        'responded_at'
    ]
    fieldsets = (
        ('Remetente', {
            'fields': (
                'name',
                'email',
                'phone',
                'user'
            )
        }),
        ('Mensagem', {
            'fields': (
                'subject',
                'message',
                'status'
            )
        }),
        ('Resposta', {
            'fields': (
                'response',
                'responded_by',
                'responded_at'
            ),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at'
            )
        })
    )
    actions = ['mark_as_read', 'mark_as_archived']
    
    def mark_as_read(self, request, queryset):
        """Marca mensagens selecionadas como lidas"""
        updated = queryset.update(status='read')
        self.message_user(request, f'{updated} mensagem(ns) marcada(s) como lida(s).')
    mark_as_read.short_description = 'Marcar como lida'
    
    def mark_as_archived(self, request, queryset):
        """Arquiva mensagens selecionadas"""
        updated = queryset.update(status='archived')
        self.message_user(request, f'{updated} mensagem(ns) arquivada(s).')
    mark_as_archived.short_description = 'Arquivar'

