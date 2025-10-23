"""
Views para funcionalidades de acessibilidade.
"""
import os
import hashlib
import base64
from pathlib import Path
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import TTSRequestSerializer, TTSResponseSerializer

# Importação condicional do Google Cloud TTS
try:
    from google.cloud import texttospeech
    GOOGLE_TTS_AVAILABLE = True
except ImportError:
    GOOGLE_TTS_AVAILABLE = False


# Diretório para cache de áudios TTS
TTS_CACHE_DIR = Path(settings.MEDIA_ROOT) / 'tts_cache'
TTS_CACHE_DIR.mkdir(parents=True, exist_ok=True)


def get_cache_key(text: str, language_code: str, voice_gender: str) -> str:
    """
    Gera uma chave única para cache baseada nos parâmetros.
    """
    content = f"{text}_{language_code}_{voice_gender}"
    return hashlib.md5(content.encode()).hexdigest()


def synthesize_speech_google(text: str, language_code: str = 'pt-BR', 
                             voice_gender: str = 'NEUTRAL') -> bytes:
    """
    Sintetiza fala usando Google Cloud Text-to-Speech API.
    
    Args:
        text: Texto para sintetizar
        language_code: Código do idioma (ex: 'pt-BR', 'en-US')
        voice_gender: Gênero da voz ('NEUTRAL', 'MALE', 'FEMALE')
    
    Returns:
        Conteúdo do áudio em bytes
    """
    if not GOOGLE_TTS_AVAILABLE:
        raise ImportError("google-cloud-texttospeech não está instalado")
    
    # Instancia o cliente
    client = texttospeech.TextToSpeechClient()
    
    # Define o input de texto
    synthesis_input = texttospeech.SynthesisInput(text=text)
    
    # Mapeia o gênero da voz
    gender_map = {
        'NEUTRAL': texttospeech.SsmlVoiceGender.NEUTRAL,
        'MALE': texttospeech.SsmlVoiceGender.MALE,
        'FEMALE': texttospeech.SsmlVoiceGender.FEMALE,
    }
    
    # Configura a voz
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        ssml_gender=gender_map.get(voice_gender, texttospeech.SsmlVoiceGender.NEUTRAL)
    )
    
    # Configura o formato do áudio
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )
    
    # Realiza a requisição de síntese
    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config
    )
    
    return response.audio_content


def synthesize_speech_fallback(text: str) -> bytes:
    """
    Fallback simples quando Google TTS não está disponível.
    Retorna um áudio de exemplo (silêncio) apenas para desenvolvimento.
    """
    # Este é apenas um placeholder - em produção você pode usar outra API
    # ou retornar um erro apropriado
    return b''


@api_view(['POST'])
@permission_classes([AllowAny])
def text_to_speech_view(request):
    """
    Endpoint para conversão de texto em áudio (Text-to-Speech).
    
    POST /api/accessibility/tts/
    Body:
    {
        "text": "Texto para converter em áudio",
        "language_code": "pt-BR",  # opcional
        "voice_gender": "NEUTRAL"   # opcional (NEUTRAL, MALE, FEMALE)
    }
    
    Response:
    {
        "audio_content": "base64_encoded_audio",
        "text": "Texto original",
        "cache_key": "hash_do_cache"
    }
    """
    serializer = TTSRequestSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    text = serializer.validated_data['text']
    language_code = serializer.validated_data.get('language_code', 'pt-BR')
    voice_gender = serializer.validated_data.get('voice_gender', 'NEUTRAL')
    
    # Gera chave de cache
    cache_key = get_cache_key(text, language_code, voice_gender)
    cache_file = TTS_CACHE_DIR / f"{cache_key}.mp3"
    
    # Verifica se já existe no cache
    if cache_file.exists():
        with open(cache_file, 'rb') as f:
            audio_content = f.read()
    else:
        # Sintetiza o áudio
        try:
            if GOOGLE_TTS_AVAILABLE and os.getenv('GOOGLE_APPLICATION_CREDENTIALS'):
                audio_content = synthesize_speech_google(
                    text, language_code, voice_gender
                )
            else:
                # Fallback ou modo de desenvolvimento
                return Response(
                    {
                        "error": "Google Cloud TTS não configurado",
                        "detail": "Configure GOOGLE_APPLICATION_CREDENTIALS para usar TTS",
                        "fallback": True
                    },
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            
            # Salva no cache
            with open(cache_file, 'wb') as f:
                f.write(audio_content)
                
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    # Codifica em base64 para enviar na resposta
    audio_base64 = base64.b64encode(audio_content).decode('utf-8')
    
    response_data = {
        'audio_content': audio_base64,
        'text': text,
        'cache_key': cache_key,
        'audio_url': f"{settings.MEDIA_URL}tts_cache/{cache_key}.mp3"
    }
    
    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def accessibility_config_view(request):
    """
    Retorna configurações de acessibilidade disponíveis.
    
    GET /api/accessibility/config/
    """
    config = {
        'tts_enabled': GOOGLE_TTS_AVAILABLE and bool(os.getenv('GOOGLE_APPLICATION_CREDENTIALS')),
        'supported_languages': [
            {'code': 'pt-BR', 'name': 'Português (Brasil)'},
            {'code': 'en-US', 'name': 'English (US)'},
            {'code': 'es-ES', 'name': 'Español (España)'},
        ],
        'voice_genders': ['NEUTRAL', 'MALE', 'FEMALE'],
        'features': {
            'text_to_speech': True,
            'high_contrast': True,
            'font_size_adjustment': True,
            'simplified_reading': True,
            'libras_support': True,
        }
    }
    
    return Response(config, status=status.HTTP_200_OK)
