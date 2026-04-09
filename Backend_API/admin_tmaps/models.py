from django.db import models
from django.contrib.auth.models import User
from Herramientas.get_direccion_tmaps import get_direccion_tmaps

class Empleado(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    nombre_completo = models.CharField(max_length=200)
    puesto = models.CharField(max_length=100)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre_completo

class Direccion(models.Model):
    empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE)
    latitud = models.CharField(max_length=20)
    longitud = models.CharField(max_length=20)
    direccion_completa = models.CharField(max_length=300, blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.empleado.nombre_completo}"

    def save(self, *args, **kwargs):
        self.direccion_completa = get_direccion_tmaps(self.latitud, self.longitud)
        super().save(*args, **kwargs)