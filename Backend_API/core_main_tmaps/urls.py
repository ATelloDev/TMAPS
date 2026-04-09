from django.contrib import admin
from django.urls import path, include
from core_api import views as api_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('admin_tmaps.urls')),
    path('api-auth/', include('rest_framework.urls')),
    # Custom API endpoints without authentication
    path('api/empleados/', api_views.empleados_list, name='api_empleados_list'),
    path('api/empleados/<int:employee_id>/', api_views.empleado_detail, name='api_empleado_detail'),
    path('api/direcciones/', api_views.direcciones_list, name='api_direcciones_list'),
    path('api/direcciones/<int:direccion_id>/', api_views.direccion_detail, name='api_direccion_detail'),
    # API Tmaps endpoints
    path('api/', include('core_api.urls')),
]
