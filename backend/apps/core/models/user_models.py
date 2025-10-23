"""
Modelos de usuário para João Macarrão.
"""
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Modelo de usuário customizado para João Macarrão.
    Sistema completo de autenticação com roles e perfis.
    """
    # Choices para roles
    ROLE_CHOICES = [
        ('cliente', 'Cliente'),
        ('atendente', 'Atendente'),
        ('admin', 'Administrador'),
    ]
    
    # Campos principais
    email = models.EmailField(unique=True, verbose_name='E-mail')
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='cliente',
        verbose_name='Função'
    )
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name='Telefone'
    )
    
    # Campos de auditoria
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em', null=True)
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')
    
    # Campos de acessibilidade
    needs_accessibility = models.BooleanField(default=False, verbose_name='Necessita acessibilidade')
    accessibility_notes = models.TextField(blank=True, null=True, verbose_name='Notas de acessibilidade')
    
    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.email or self.username
    
    def is_admin(self):
        """Verifica se o usuário é admin"""
        return self.role == 'admin' or self.is_superuser
    
    def is_atendente(self):
        """Verifica se o usuário é atendente"""
        return self.role == 'atendente' or self.is_admin()
    
    def is_cliente(self):
        """Verifica se o usuário é cliente"""
        return self.role == 'cliente'


