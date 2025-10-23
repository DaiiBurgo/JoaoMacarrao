"""
Views para autenticação e gerenciamento de usuários.
João Macarrão - Sistema de Autenticação JWT
"""
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import get_user_model

from ..serializers.auth_serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register/
    Cria um novo usuário no sistema.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Gera tokens JWT para o novo usuário
        login_serializer = LoginSerializer()
        tokens = login_serializer.get_tokens(user)
        
        # Retorna dados do usuário e tokens
        user_data = UserSerializer(user).data
        
        return Response({
            'message': 'Usuário registrado com sucesso!',
            'user': user_data,
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    POST /api/auth/login/
    Autentica usuário e retorna tokens JWT (access e refresh).
    """
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    
    def post(self, request):
        serializer = LoginSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        tokens = serializer.get_tokens(user)
        user_data = UserSerializer(user).data
        
        return Response({
            'message': 'Login realizado com sucesso!',
            'user': user_data,
            'tokens': tokens
        }, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    GET /api/auth/me/
    Retorna dados do usuário autenticado.
    
    PUT/PATCH /api/auth/me/
    Atualiza dados do usuário autenticado.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        """Retorna o usuário autenticado"""
        return self.request.user
    
    def retrieve(self, request, *args, **kwargs):
        """GET - Retorna perfil do usuário"""
        serializer = self.get_serializer(request.user)
        return Response({
            'message': 'Perfil do usuário',
            'user': serializer.data
        })
    
    def update(self, request, *args, **kwargs):
        """PUT/PATCH - Atualiza perfil do usuário"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'message': 'Perfil atualizado com sucesso!',
            'user': serializer.data
        })


