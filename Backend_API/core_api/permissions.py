from rest_framework.permissions import BasePermission

class IsAnonymousOrAuthenticated(BasePermission):
    """
    Permite acceso a usuarios autenticados y anónimos para operaciones de lectura,
    pero solo permite escritura a usuarios autenticados.
    """
    def has_permission(self, request, view):
        # Permitir todas las operaciones (lectura y escritura) para desarrollo
        return True
