import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, ArrowLeft, Save, Map } from 'lucide-react';
import { employeeAPI, addressAPI } from '../services/api';

export function AddAddress() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get('employee');
  
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    empleado: employeeId || '',
    latitud: '',
    longitud: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.empleado) {
      newErrors.empleado = 'Debes seleccionar un empleado';
    }
    
    if (!formData.latitud.trim()) {
      newErrors.latitud = 'La latitud es requerida';
    } else if (isNaN(formData.latitud) || parseFloat(formData.latitud) < -90 || parseFloat(formData.latitud) > 90) {
      newErrors.latitud = 'La latitud debe estar entre -90 y 90';
    }
    
    if (!formData.longitud.trim()) {
      newErrors.longitud = 'La longitud es requerida';
    } else if (isNaN(formData.longitud) || parseFloat(formData.longitud) < -180 || parseFloat(formData.longitud) > 180) {
      newErrors.longitud = 'La longitud debe estar entre -180 y 180';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await addressAPI.create(formData);
      navigate('/employees');
    } catch (error) {
      console.error('Error creating address:', error);
      setErrors({ submit: 'Error al crear la dirección. Inténtalo nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitud: position.coords.latitude.toString(),
            longitud: position.coords.longitude.toString()
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('No se pudo obtener tu ubicación actual');
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/employees')}
          className="btn-secondary p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agregar Nueva Dirección</h1>
          <p className="text-gray-600">Registra la ubicación de un empleado</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary-600" />
              <h2 className="card-title">Información de la Dirección</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="btn-secondary flex items-center"
            >
              <Map className="h-4 w-4 mr-2" />
              {showMap ? 'Ocultar Mapa' : 'Ver Mapa'}
            </button>
          </div>
        </div>

        {showMap && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Mapa interactivo (próximamente)</p>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="btn-primary text-sm"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Usar mi ubicación actual
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="empleado" className="block text-sm font-medium text-gray-700 mb-2">
              Empleado *
            </label>
            <select
              id="empleado"
              name="empleado"
              value={formData.empleado}
              onChange={handleChange}
              className={`input-field ${errors.empleado ? 'border-red-500' : ''}`}
            >
              <option value="">Selecciona un empleado</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.nombre_completo} - {employee.puesto}
                </option>
              ))}
            </select>
            {errors.empleado && (
              <p className="mt-1 text-sm text-red-600">{errors.empleado}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="latitud" className="block text-sm font-medium text-gray-700 mb-2">
                Latitud *
              </label>
              <input
                type="text"
                id="latitud"
                name="latitud"
                value={formData.latitud}
                onChange={handleChange}
                className={`input-field ${errors.latitud ? 'border-red-500' : ''}`}
                placeholder="Ej: 19.4326"
                step="any"
              />
              {errors.latitud && (
                <p className="mt-1 text-sm text-red-600">{errors.latitud}</p>
              )}
            </div>

            <div>
              <label htmlFor="longitud" className="block text-sm font-medium text-gray-700 mb-2">
                Longitud *
              </label>
              <input
                type="text"
                id="longitud"
                name="longitud"
                value={formData.longitud}
                onChange={handleChange}
                className={`input-field ${errors.longitud ? 'border-red-500' : ''}`}
                placeholder="Ej: -99.1332"
                step="any"
              />
              {errors.longitud && (
                <p className="mt-1 text-sm text-red-600">{errors.longitud}</p>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-600">
              <strong>Nota:</strong> La dirección completa se generará automáticamente usando las coordenadas proporcionadas.
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Guardando...' : 'Guardar Dirección'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
