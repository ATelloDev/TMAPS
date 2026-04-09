from rest_framework import  serializers
from admin_tmaps.models import Direccion


class DireccionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Direccion
        fields = ['empleado', 'latitud', 'longitud']