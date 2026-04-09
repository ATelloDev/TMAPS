from core_api.Serializers.empleado_serializer import *
from rest_framework import  viewsets
from admin_tmaps.models import Empleado
from core_api.permissions import IsAnonymousOrAuthenticated

class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer
    permission_classes = [IsAnonymousOrAuthenticated]