"""
Config do app de contato.
João Macarrão - Sistema de Contato
"""
from django.apps import AppConfig


class ContactConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.contact'
    verbose_name = 'Contato'

