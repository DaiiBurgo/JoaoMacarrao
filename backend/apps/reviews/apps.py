"""
Config do app de reviews.
João Macarrão - Sistema de Avaliações
"""
from django.apps import AppConfig


class ReviewsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.reviews'
    verbose_name = 'Avaliações'

