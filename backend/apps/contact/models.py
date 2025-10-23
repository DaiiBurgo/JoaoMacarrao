"""
Modelos de contato para João Macarrão.
Sistema de mensagens de contato dos clientes.
"""
from django.db import models
from django.conf import settings


class ContactMessage(models.Model):
    """
    Modelo de Mensagem de Contato.
    Armazena mensagens enviadas pelos clientes através do formulário de contato.
    """
    
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('read', 'Lida'),
        ('replied', 'Respondida'),
        ('archived', 'Arquivada'),
    ]
    
    # Dados do remetente
    name = models.CharField(
        max_length=100,
        verbose_name='Nome'
    )
    email = models.EmailField(
        verbose_name='E-mail'
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name='Telefone'
    )
    
    # Usuário (se estiver logado)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='contact_messages',
        verbose_name='Usuário'
    )
    
    # Conteúdo da mensagem
    subject = models.CharField(
        max_length=150,
        verbose_name='Assunto'
    )
    message = models.TextField(
        verbose_name='Mensagem'
    )
    
    # Status e resposta
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Status'
    )
    response = models.TextField(
        blank=True,
        null=True,
        verbose_name='Resposta'
    )
    responded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='responded_messages',
        verbose_name='Respondido por'
    )
    responded_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Respondido em'
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
        verbose_name = 'Mensagem de Contato'
        verbose_name_plural = 'Mensagens de Contato'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.subject} ({self.get_status_display()})"
    
    def mark_as_read(self):
        """Marca mensagem como lida"""
        if self.status == 'pending':
            self.status = 'read'
            self.save()
    
    def mark_as_replied(self, response, user):
        """Marca mensagem como respondida"""
        from django.utils import timezone
        
        self.status = 'replied'
        self.response = response
        self.responded_by = user
        self.responded_at = timezone.now()
        self.save()

