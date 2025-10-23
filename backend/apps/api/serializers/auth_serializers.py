"""
Serializers para autenticação e gerenciamento de usuários.
João Macarrão - Sistema de Autenticação JWT
"""
from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer para dados do usuário.
    Retorna informações básicas do perfil.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone_number', 'date_joined', 'needs_accessibility']
        read_only_fields = ['id', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer para registro de novos usuários.
    Valida senha e cria usuário com create_user.
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'password_confirm',
            'phone_number',
            'role',
            'needs_accessibility'
        ]
        extra_kwargs = {
            'email': {'required': True},
            'role': {'default': 'cliente'}
        }
    
    def validate_email(self, value):
        """Valida se o email já não está em uso"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este email já está em uso.")
        return value
    
    def validate(self, data):
        """Valida se as senhas coincidem"""
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({
                "password_confirm": "As senhas não coincidem."
            })
        return data
    
    def create(self, validated_data):
        """Cria novo usuário usando create_user"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        # Define role padrão como 'cliente' se não fornecido
        if 'role' not in validated_data:
            validated_data['role'] = 'cliente'
        
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class LoginSerializer(serializers.Serializer):
    """
    Serializer para autenticação de usuários.
    Usa authenticate e retorna JWT tokens.
    """
    username = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={'input_type': 'password'}
    )
    
    def validate(self, data):
        """Autentica o usuário e valida credenciais"""
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            # Tenta autenticar com username
            user = authenticate(
                request=self.context.get('request'),
                username=username,
                password=password
            )
            
            # Se não encontrar, tenta com email
            if not user:
                try:
                    user_obj = User.objects.get(email=username)
                    user = authenticate(
                        request=self.context.get('request'),
                        username=user_obj.username,
                        password=password
                    )
                except User.DoesNotExist:
                    pass
            
            if not user:
                raise serializers.ValidationError(
                    "Credenciais inválidas. Verifique seu usuário/email e senha."
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    "Esta conta está desativada."
                )
            
            data['user'] = user
            return data
        else:
            raise serializers.ValidationError(
                "Usuário e senha são obrigatórios."
            )
    
    def get_tokens(self, user):
        """Gera tokens JWT para o usuário"""
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


