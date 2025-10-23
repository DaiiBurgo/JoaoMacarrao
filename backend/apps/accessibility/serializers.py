"""
Serializers para funcionalidades de acessibilidade.
"""
from rest_framework import serializers


class TTSRequestSerializer(serializers.Serializer):
    """Serializer para requisição de Text-to-Speech"""
    text = serializers.CharField(
        required=True,
        max_length=5000,
        help_text="Texto para ser convertido em áudio"
    )
    language_code = serializers.CharField(
        required=False,
        default='pt-BR',
        help_text="Código do idioma (padrão: pt-BR)"
    )
    voice_gender = serializers.ChoiceField(
        choices=['NEUTRAL', 'MALE', 'FEMALE'],
        required=False,
        default='NEUTRAL',
        help_text="Gênero da voz"
    )


class TTSResponseSerializer(serializers.Serializer):
    """Serializer para resposta de Text-to-Speech"""
    audio_content = serializers.CharField(
        help_text="Conteúdo do áudio em base64"
    )
    text = serializers.CharField(
        help_text="Texto original"
    )
    cache_key = serializers.CharField(
        help_text="Chave para cache do áudio"
    )

