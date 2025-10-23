"""
URLs para autenticação e gerenciamento de usuários.
João Macarrão - Sistema de Autenticação JWT
"""
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)

from ..views.auth_views import RegisterView, LoginView, UserProfileView

app_name = 'auth'

urlpatterns = [
    # Registro e Login
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    
    # Perfil do usuário
    path('me/', UserProfileView.as_view(), name='user-profile'),
    
    # Tokens JWT (views padrão do SimpleJWT)
    path('token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token-verify'),
]


