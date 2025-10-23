# Views package for João Macarrão API
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from .auth_views import RegisterView, LoginView, UserProfileView
from .menu_views import CategoryViewSet, DishViewSet
from .order_views import OrderViewSet


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Endpoint de health check para verificar se a API está funcionando.
    """
    return Response({
        'status': 'ok',
        'message': 'João Macarrão API está funcionando!',
        'version': '4.0.0'
    }, status=status.HTTP_200_OK)


__all__ = [
    'RegisterView',
    'LoginView',
    'UserProfileView',
    'CategoryViewSet',
    'DishViewSet',
    'OrderViewSet',
    'health_check'
]

