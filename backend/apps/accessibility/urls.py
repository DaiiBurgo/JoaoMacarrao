"""
URLs para funcionalidades de acessibilidade.
"""
from django.urls import path
from .views import text_to_speech_view, accessibility_config_view

app_name = 'accessibility'

urlpatterns = [
    path('tts/', text_to_speech_view, name='text-to-speech'),
    path('config/', accessibility_config_view, name='config'),
]

