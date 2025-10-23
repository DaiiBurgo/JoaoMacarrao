"""
Admin para reviews.
João Macarrão - Sistema de Avaliações
"""
from django.contrib import admin
from .models import DishReview, ReviewHelpful


@admin.register(DishReview)
class DishReviewAdmin(admin.ModelAdmin):
    """
    Admin para DishReview.
    """
    list_display = [
        'id',
        'dish',
        'user',
        'rating',
        'is_approved',
        'helpful_count',
        'created_at'
    ]
    list_filter = [
        'rating',
        'is_approved',
        'created_at',
        'dish__category'
    ]
    search_fields = [
        'dish__name',
        'user__username',
        'user__email',
        'comment'
    ]
    readonly_fields = [
        'helpful_count',
        'created_at',
        'updated_at'
    ]
    fieldsets = (
        ('Avaliação', {
            'fields': (
                'dish',
                'user',
                'rating',
                'comment'
            )
        }),
        ('Moderação', {
            'fields': (
                'is_approved',
                'helpful_count'
            )
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at'
            )
        })
    )
    actions = ['approve_reviews', 'reject_reviews']
    
    def approve_reviews(self, request, queryset):
        """Aprova avaliações selecionadas"""
        updated = queryset.update(is_approved=True)
        self.message_user(request, f'{updated} avaliação(ões) aprovada(s).')
    approve_reviews.short_description = 'Aprovar avaliações selecionadas'
    
    def reject_reviews(self, request, queryset):
        """Rejeita avaliações selecionadas"""
        updated = queryset.update(is_approved=False)
        self.message_user(request, f'{updated} avaliação(ões) rejeitada(s).')
    reject_reviews.short_description = 'Rejeitar avaliações selecionadas'


@admin.register(ReviewHelpful)
class ReviewHelpfulAdmin(admin.ModelAdmin):
    """
    Admin para ReviewHelpful.
    """
    list_display = [
        'id',
        'review',
        'user',
        'created_at'
    ]
    list_filter = [
        'created_at'
    ]
    search_fields = [
        'review__dish__name',
        'user__username'
    ]
    readonly_fields = ['created_at']

