import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Edit, Trash2, Plus, Calendar, Briefcase } from 'lucide-react';
import { employeeAPI, addressAPI } from '../services/api';

export function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      const [employeeRes, addressesRes] = await Promise.all([
        employeeAPI.getById(id),
        addressAPI.getByEmployee(id),
      ]);

      setEmployee(employeeRes.data);
      setAddresses(addressesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      setError('No se pudo cargar la información del empleado');
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este empleado y todas sus direcciones?')) {
      try {
        await employeeAPI.delete(id);
        navigate('/employees');
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Error al eliminar el empleado');
      }
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
      try {
        await addressAPI.delete(addressId);
        setAddresses(addresses.filter(addr => addr.id !== addressId));
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Error al eliminar la dirección');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
        <p className="text-gray-600 mb-4">{error || 'Empleado no encontrado'}</p>
        <Link to="/employees" className="btn-primary">
          Volver a Empleados
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/employees')}
            className="btn-secondary p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{employee.nombre_completo}</h1>
            <p className="text-gray-600">Detalles del empleado</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to={`/add-address?employee=${employee.id}`}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Dirección
          </Link>
          <button
            onClick={handleDeleteEmployee}
            className="btn-secondary text-red-600 hover:text-red-700 flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Información Personal</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                <p className="text-gray-900">{employee.nombre_completo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Puesto</label>
                <p className="text-gray-900">{employee.puesto}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Registro</label>
                <div className="flex items-center text-gray-900">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  {new Date(employee.fecha_registro).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Direcciones</label>
                <div className="flex items-center text-gray-900">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  {addresses.length} ubicaciones
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-6">
            <div className="card-header">
              <h2 className="card-title">Estadísticas</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cobertura</span>
                <span className="text-sm font-medium text-primary-600">
                  {addresses.length > 0 ? 'Completa' : 'Pendiente'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estado</span>
                <span className="text-sm font-medium text-green-600">
                  Activo
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary-600" />
                  <h2 className="card-title">Direcciones Registradas</h2>
                </div>
                <span className="text-sm text-gray-500">
                  {addresses.length} {addresses.length === 1 ? 'dirección' : 'direcciones'}
                </span>
              </div>
            </div>

            {addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map((address, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="h-4 w-4 text-primary-600" />
                          <h3 className="font-medium text-gray-900">Ubicación #{index + 1}</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="text-xs font-medium text-gray-500">Coordenadas</label>
                            <p className="text-sm text-gray-900">
                              {address.latitud}, {address.longitud}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500">Fecha de Registro</label>
                            <p className="text-sm text-gray-900">
                              {new Date(address.fecha_registro).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>

                        {address.direccion_completa && (
                          <div className="mb-3">
                            <label className="text-xs font-medium text-gray-500">Dirección Completa</label>
                            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                              {address.direccion_completa}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(
                              `https://www.google.com/maps?q=${address.latitud},${address.longitud}`,
                              '_blank'
                            )}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            Ver en Google Maps
                          </button>
                          <span className="text-gray-300">•</span>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-sm text-red-600 hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sin direcciones registradas</h3>
                <p className="text-gray-600 mb-4">
                  Este empleado aún no tiene direcciones asociadas
                </p>
                <Link
                  to={`/add-address?employee=${employee.id}`}
                  className="btn-primary inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primera Dirección
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
