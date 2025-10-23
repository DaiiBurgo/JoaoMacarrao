from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserRegistrationSerializer, UserSerializer, LoginSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Endpoint stub para registro de usuários.
    TODO: Implementar lógica completa de registro com validações.
    """
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        # TODO: Implementar lógica completa
        # - Validações adicionais
        # - Envio de email de confirmação
        # - etc.
        user = serializer.save()
        
        # Gera tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Usuário registrado com sucesso (stub)',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Endpoint stub para login de usuários.
    TODO: Implementar lógica completa de autenticação.
    """
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        # TODO: Implementar lógica completa
        # - Throttling
        # - Logging de tentativas
        # - 2FA (se necessário)
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Login realizado com sucesso (stub)',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        
        return Response({
            'error': 'Credenciais inválidas'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def profile(request):
    """
    Endpoint stub para obter perfil do usuário autenticado.
    """
    return Response({
        'message': 'Perfil do usuário (stub)',
        'user': UserSerializer(request.user).data
    })

