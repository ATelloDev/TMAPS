from django.urls import path
from . import views


urlpatterns = [
    # Custom API endpoints without authentication
    path('empleados/', views.empleados_list, name='empleados_list'),
    path('empleados/<int:employee_id>/', views.empleado_detail, name='empleado_detail'),
    path('direcciones/', views.direcciones_list, name='direcciones_list'),
    path('direcciones/<int:direccion_id>/', views.direccion_detail, name='direccion_detail'),
]