from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from admin_tmaps.models import Empleado, Direccion
from django.utils import timezone

@csrf_exempt
@require_http_methods(["GET", "POST"])
def empleados_list(request):
    if request.method == 'GET':
        empleados = Empleado.objects.all()
        data = []
        for emp in empleados:
            data.append({
                'id': emp.id,
                'nombre_completo': emp.nombre_completo,
                'puesto': emp.puesto,
                'fecha_registro': emp.fecha_registro.isoformat(),
                'user': emp.user.id if emp.user else None
            })
        return JsonResponse(data, safe=False)
    
    elif request.method == 'POST':
        try:
            body = json.loads(request.body)
            empleado = Empleado.objects.create(
                nombre_completo=body['nombre_completo'],
                puesto=body['puesto']
            )
            return JsonResponse({
                'id': empleado.id,
                'nombre_completo': empleado.nombre_completo,
                'puesto': empleado.puesto,
                'fecha_registro': empleado.fecha_registro.isoformat()
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET", "DELETE"])
def empleado_detail(request, employee_id):
    if request.method == 'GET':
        try:
            empleado = Empleado.objects.get(id=employee_id)
            return JsonResponse({
                'id': empleado.id,
                'nombre_completo': empleado.nombre_completo,
                'puesto': empleado.puesto,
                'fecha_registro': empleado.fecha_registro.isoformat(),
                'user': empleado.user.id if empleado.user else None
            })
        except Empleado.DoesNotExist:
            return JsonResponse({'error': 'Employee not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    elif request.method == 'DELETE':
        try:
            empleado = Empleado.objects.get(id=employee_id)
            empleado.delete()
            return JsonResponse({'message': 'Employee deleted successfully'}, status=204)
        except Empleado.DoesNotExist:
            return JsonResponse({'error': 'Employee not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET", "POST"])
def direcciones_list(request):
    if request.method == 'GET':
        direcciones = Direccion.objects.all()
        data = []
        for dir in direcciones:
            data.append({
                'id': dir.id,
                'empleado': dir.empleado.id,
                'empleado_nombre': dir.empleado.nombre_completo,
                'latitud': dir.latitud,
                'longitud': dir.longitud,
                'direccion_completa': dir.direccion_completa,
                'fecha_registro': dir.fecha_registro.isoformat()
            })
        return JsonResponse(data, safe=False)
    
    elif request.method == 'POST':
        try:
            body = json.loads(request.body)
            empleado = Empleado.objects.get(id=body['empleado'])
            direccion = Direccion.objects.create(
                empleado=empleado,
                latitud=body['latitud'],
                longitud=body['longitud']
            )
            return JsonResponse({
                'id': direccion.id,
                'empleado': direccion.empleado.id,
                'empleado_nombre': direccion.empleado.nombre_completo,
                'latitud': direccion.latitud,
                'longitud': direccion.longitud,
                'direccion_completa': direccion.direccion_completa,
                'fecha_registro': direccion.fecha_registro.isoformat()
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["DELETE"])
def direccion_detail(request, direccion_id):
    try:
        direccion = Direccion.objects.get(id=direccion_id)
        direccion.delete()
        return JsonResponse({'message': 'Address deleted successfully'}, status=204)
    except Direccion.DoesNotExist:
        return JsonResponse({'error': 'Address not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
