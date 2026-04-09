from admin_tmaps.models import Empleado
from rest_framework import  serializers

class EmpleadoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Empleado
        fields = ['nombre_completo', 'puesto', 'fecha_registro']