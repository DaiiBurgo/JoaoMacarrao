"""
Permissões customizadas para João Macarrão API.
"""
from rest_framework import permissions


class IsAtendenteOrAdmin(permissions.BasePermission):
    """
    Permissão customizada para permitir acesso apenas a atendentes e admins.
    """
    message = "Você precisa ser atendente ou administrador para realizar esta ação."
    
    def has_permission(self, request, view):
        # Permite leitura para todos (authenticated ou não)
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Para write methods, requer autenticação
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Verifica se é atendente ou admin
        return (
            request.user.role in ['atendente', 'admin'] or
            request.user.is_superuser
        )


class IsAtendenteOrAdminOrReadOnly(permissions.BasePermission):
    """
    Permissão que permite:
    - Leitura para todos (AllowAny)
    - Escrita apenas para atendentes e admins (autenticados)
    """
    message = "Você precisa ser atendente ou administrador para modificar este recurso."
    
    def has_permission(self, request, view):
        # Leitura é permitida para todos
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Escrita requer autenticação
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Verifica role
        return request.user.is_atendente() or request.user.is_admin()


class IsOwnerOrAtendenteOrAdmin(permissions.BasePermission):
    """
    Permissão que permite:
    - Dono do recurso pode ler e editar
    - Atendentes e admins podem ler e editar tudo
    - Outros usuários não podem acessar
    """
    message = "Você não tem permissão para acessar este recurso."
    
    def has_permission(self, request, view):
        # Requer autenticação
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Atendentes e admins têm acesso total
        if request.user.is_atendente() or request.user.is_admin():
            return True
        
        # Verifica se o objeto tem um campo 'user' e se é o dono
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False


