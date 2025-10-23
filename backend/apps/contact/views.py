"""
Views para contato.
João Macarrão - Sistema de Contato
"""
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.core.mail import send_mail
from django.conf import settings

from .models import ContactMessage
from .serializers import (
    ContactMessageSerializer,
    ContactMessageCreateSerializer,
    ContactMessageResponseSerializer,
    ContactMessageListSerializer
)


class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de mensagens de contato.
    
    - POST (público): Enviar mensagem
    - GET (admin): Listar todas as mensagens
    - PATCH (admin): Responder mensagem
    """
    queryset = ContactMessage.objects.all()
    
    def get_permissions(self):
        """
        Permissões personalizadas.
        - create: Todos (público)
        - list, retrieve, update: Admin apenas
        """
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]
    
    def get_serializer_class(self):
        """Retorna serializer apropriado"""
        if self.action == 'create':
            return ContactMessageCreateSerializer
        elif self.action == 'list':
            return ContactMessageListSerializer
        return ContactMessageSerializer
    
    def get_queryset(self):
        """
        Filtra mensagens.
        Admin vê todas, usuários comuns veem apenas suas mensagens.
        """
        user = self.request.user
        
        if user.is_staff:
            return ContactMessage.objects.all()
        
        if user.is_authenticated:
            return ContactMessage.objects.filter(user=user)
        
        return ContactMessage.objects.none()
    
    def create(self, request, *args, **kwargs):
        """Cria nova mensagem de contato"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save()
        
        # Envia notificação por e-mail (se configurado)
        self._send_notification_email(message)
        
        return Response({
            'success': True,
            'message': 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
            'data': ContactMessageSerializer(message).data
        }, status=status.HTTP_201_CREATED)
    
    def _send_notification_email(self, message):
        """Envia e-mail de notificação para admins"""
        try:
            # E-mail para o cliente (confirmação)
            send_mail(
                subject=f'Recebemos sua mensagem: {message.subject}',
                message=f'''
Olá {message.name},

Recebemos sua mensagem e agradecemos pelo contato!

Assunto: {message.subject}

Nossa equipe analisará sua mensagem e retornaremos em breve.

Atenciosamente,
João Macarrão 🍝
                '''.strip(),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[message.email],
                fail_silently=True
            )
            
            # E-mail para admins (notificação)
            admin_emails = settings.ADMINS_EMAIL if hasattr(settings, 'ADMINS_EMAIL') else []
            if admin_emails:
                send_mail(
                    subject=f'Nova mensagem de contato: {message.subject}',
                    message=f'''
Nova mensagem recebida!

De: {message.name} ({message.email})
Assunto: {message.subject}

Mensagem:
{message.message}

---
Acesse o painel administrativo para responder.
                    '''.strip(),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=admin_emails,
                    fail_silently=True
                )
        except Exception as e:
            # Log do erro, mas não falha a criação da mensagem
            print(f"Erro ao enviar e-mail: {str(e)}")
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def respond(self, request, pk=None):
        """
        Responde a uma mensagem de contato.
        POST /api/contact/{id}/respond/
        Body: {"response": "Sua resposta..."}
        """
        message = self.get_object()
        serializer = ContactMessageResponseSerializer(data=request.data)
        
        if serializer.is_valid():
            response_text = serializer.validated_data['response']
            message.mark_as_replied(response_text, request.user)
            
            # Envia resposta por e-mail
            self._send_response_email(message)
            
            return Response({
                'success': True,
                'message': 'Resposta enviada com sucesso',
                'data': ContactMessageSerializer(message).data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def _send_response_email(self, message):
        """Envia e-mail com a resposta"""
        try:
            send_mail(
                subject=f'Re: {message.subject}',
                message=f'''
Olá {message.name},

Em resposta à sua mensagem:

{message.response}

---
Se tiver mais dúvidas, entre em contato novamente!

Atenciosamente,
João Macarrão 🍝
                '''.strip(),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[message.email],
                fail_silently=True
            )
        except Exception as e:
            print(f"Erro ao enviar resposta por e-mail: {str(e)}")
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def mark_read(self, request, pk=None):
        """
        Marca mensagem como lida.
        POST /api/contact/{id}/mark_read/
        """
        message = self.get_object()
        message.mark_as_read()
        
        return Response({
            'success': True,
            'message': 'Mensagem marcada como lida',
            'data': ContactMessageSerializer(message).data
        })
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def stats(self, request):
        """
        Estatísticas de mensagens de contato.
        GET /api/contact/stats/
        """
        total = ContactMessage.objects.count()
        pending = ContactMessage.objects.filter(status='pending').count()
        read = ContactMessage.objects.filter(status='read').count()
        replied = ContactMessage.objects.filter(status='replied').count()
        
        return Response({
            'total': total,
            'pending': pending,
            'read': read,
            'replied': replied,
            'archived': ContactMessage.objects.filter(status='archived').count()
        })

