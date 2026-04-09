import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, TrendingUp, Calendar } from 'lucide-react';
import { employeeAPI, addressAPI } from '../services/api';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalAddresses: 0,
    recentEmployees: [],
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [employeesRes, addressesRes] = await Promise.all([
          employeeAPI.getAll(),
          addressAPI.getAll(),
        ]);

        const employees = employeesRes.data;
        const addresses = addressesRes.data;

        setStats({
          totalEmployees: employees.length,
          totalAddresses: addresses.length,
          recentEmployees: employees.slice(-3).reverse(),
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Vista general del sistema TMaps</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 rounded-lg p-3">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Empleados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Direcciones</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAddresses}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cobertura</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalEmployees > 0 
                  ? Math.round((stats.totalAddresses / stats.totalEmployees) * 100) 
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actividad</p>
              <p className="text-2xl font-bold text-gray-900">Activa</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Empleados Recientes</h2>
          </div>
          <div className="space-y-3">
            {stats.recentEmployees.length > 0 ? (
              stats.recentEmployees.map((employee, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{employee.nombre_completo}</p>
                    <p className="text-sm text-gray-600">{employee.puesto}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(employee.fecha_registro).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay empleados registrados</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Acciones Rápidas</h2>
          </div>
          <div className="space-y-3">
            <Link to="/add-employee" className="w-full btn-primary justify-center inline-flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Agregar Nuevo Empleado
            </Link>
            <Link to="/map" className="w-full btn-secondary justify-center inline-flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Ver Mapa de Direcciones
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
