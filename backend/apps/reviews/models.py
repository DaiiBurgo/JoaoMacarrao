"""
Modelos de avaliações para João Macarrão.
Sistema de avaliações e feedback de pratos.
"""
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class DishReview(models.Model):
    """
    Modelo de Avaliação de Prato.
    Permite que usuários avaliem e comentem sobre pratos.
    """
    
    # Relacionamentos
    dish = models.ForeignKey(
        'core.Dish',
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name='Prato'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='dish_reviews',
        verbose_name='Usuário'
    )
    
    # Avaliação
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name='Avaliação',
        help_text='De 1 a 5 estrelas'
    )
    comment = models.TextField(
        blank=True,
        null=True,
        verbose_name='Comentário'
    )
    
    # Status
    is_approved = models.BooleanField(
        default=True,
        verbose_name='Aprovado',
        help_text='Avaliações podem ser moderadas antes de aparecer publicamente'
    )
    
    # Interações
    helpful_count = models.PositiveIntegerField(
        default=0,
        verbose_name='Útil',
        help_text='Quantas pessoas acharam esta avaliação útil'
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Criado em'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Atualizado em'
    )
    
    class Meta:
        verbose_name = 'Avaliação de Prato'
        verbose_name_plural = 'Avaliações de Pratos'
        ordering = ['-created_at']
        unique_together = ['dish', 'user']  # Um usuário só pode avaliar cada prato uma vez
    
    def __str__(self):
        stars = '⭐' * self.rating
        return f"{self.user.username} - {self.dish.name} - {stars}"
    
    def save(self, *args, **kwargs):
        """Atualiza média de avaliações do prato após salvar"""
        super().save(*args, **kwargs)
        self.dish.update_rating()
    
    def delete(self, *args, **kwargs):
        """Atualiza média de avaliações do prato após deletar"""
        dish = self.dish
        super().delete(*args, **kwargs)
        dish.update_rating()


class ReviewHelpful(models.Model):
    """
    Modelo para rastrear quem marcou uma avaliação como útil.
    """
    review = models.ForeignKey(
        DishReview,
        on_delete=models.CASCADE,
        related_name='helpful_marks'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='helpful_reviews'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['review', 'user']
        verbose_name = 'Marcação de Útil'
        verbose_name_plural = 'Marcações de Útil'

