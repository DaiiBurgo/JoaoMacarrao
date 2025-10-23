"""
Serializers para contato.
João Macarrão - Sistema de Contato
"""
from rest_framework import serializers
from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    """
    Serializer para ContactMessage.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    responded_by_name = serializers.CharField(source='responded_by.username', read_only=True)
    
    class Meta:
        model = ContactMessage
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'user',
            'subject',
            'message',
            'status',
            'status_display',
            'response',
            'responded_by',
            'responded_by_name',
            'responded_at',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'user',
            'status',
            'response',
            'responded_by',
            'responded_at',
            'created_at',
            'updated_at'
        ]


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para criação de mensagem de contato.
    """
    
    class Meta:
        model = ContactMessage
        fields = [
            'name',
            'email',
            'phone',
            'subject',
            'message'
        ]
    
    def validate_email(self, value):
        """Valida formato do email"""
        if not value or '@' not in value:
            raise serializers.ValidationError("E-mail inválido.")
        return value.lower()
    
    def validate_message(self, value):
        """Valida tamanho da mensagem"""
        if len(value.strip()) < 10:
            raise serializers.ValidationError(
                "A mensagem deve ter pelo menos 10 caracteres."
            )
        return value.strip()
    
    def create(self, validated_data):
        """Cria mensagem de contato"""
        # Se houver usuário autenticado, associa
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            validated_data['user'] = user
        
        return super().create(validated_data)


class ContactMessageResponseSerializer(serializers.Serializer):
    """
    Serializer para resposta a uma mensagem de contato.
    """
    response = serializers.CharField(required=True)
    
    def validate_response(self, value):
        """Valida resposta"""
        if len(value.strip()) < 10:
            raise serializers.ValidationError(
                "A resposta deve ter pelo menos 10 caracteres."
            )
        return value.strip()


class ContactMessageListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listagem de mensagens.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = ContactMessage
        fields = [
            'id',
            'name',
            'email',
            'subject',
            'status',
            'status_display',
            'created_at'
        ]

