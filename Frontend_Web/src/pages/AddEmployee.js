import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Save } from 'lucide-react';
import { employeeAPI } from '../services/api';

export function AddEmployee() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_completo: '',
    puesto: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    
    if (!formData.nombre_completo.trim()) {
      newErrors.nombre_completo = 'El nombre completo es requerido';
    }
    
    if (!formData.puesto.trim()) {
      newErrors.puesto = 'El puesto es requerido';
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
      await employeeAPI.create(formData);
      navigate('/employees');
    } catch (error) {
      console.error('Error creating employee:', error);
      setErrors({ submit: 'Error al crear el empleado. Inténtalo nuevamente.' });
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Agregar Nuevo Empleado</h1>
          <p className="text-gray-600">Completa el formulario para registrar un nuevo empleado</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary-600" />
            <h2 className="card-title">Información del Empleado</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nombre_completo" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="nombre_completo"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              className={`input-field ${errors.nombre_completo ? 'border-red-500' : ''}`}
              placeholder="Ej: Juan Pérez García"
            />
            {errors.nombre_completo && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre_completo}</p>
            )}
          </div>

          <div>
            <label htmlFor="puesto" className="block text-sm font-medium text-gray-700 mb-2">
              Puesto *
            </label>
            <input
              type="text"
              id="puesto"
              name="puesto"
              value={formData.puesto}
              onChange={handleChange}
              className={`input-field ${errors.puesto ? 'border-red-500' : ''}`}
              placeholder="Ej: Desarrollador Senior"
            />
            {errors.puesto && (
              <p className="mt-1 text-sm text-red-600">{errors.puesto}</p>
            )}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

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
              {loading ? 'Guardando...' : 'Guardar Empleado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
