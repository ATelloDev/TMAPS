from core_api.Serializers.direccion_serializer import *
from rest_framework import  viewsets
from admin_tmaps.models import Direccion
from core_api.permissions import IsAnonymousOrAuthenticated

class DireccionViewSet(viewsets.ModelViewSet):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer
    permission_classes = [IsAnonymousOrAuthenticated]

