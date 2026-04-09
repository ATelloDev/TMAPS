import React, { useState, useEffect } from 'react';
import { MapPin, Users, Layers, Filter } from 'lucide-react';
import { employeeAPI, addressAPI } from '../services/api';
import { InteractiveMap } from '../components/InteractiveMap';

export function MapView() {
  const [addresses, setAddresses] = useState([]);
  const [employees, setEmployees] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [mapCenter, setMapCenter] = useState([19.4326, -99.1332]);

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      const [addressesRes, employeesRes] = await Promise.all([
        addressAPI.getAll(),
        employeeAPI.getAll(),
      ]);

      const addressesData = addressesRes.data;
      const employeesData = employeesRes.data;

      const employeesMap = {};
      employeesData.forEach(emp => {
        employeesMap[emp.id] = emp;
      });

      setEmployees(employeesMap);
      setAddresses(addressesData);

      if (addressesData.length > 0) {
        const firstAddress = addressesData[0];
        setMapCenter([parseFloat(firstAddress.latitud), parseFloat(firstAddress.longitud)]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching map data:', error);
      setLoading(false);
    }
  };

  const filteredAddresses = selectedEmployee === 'all' 
    ? addresses 
    : addresses.filter(addr => addr.empleado.toString() === selectedEmployee);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mapa de Direcciones</h1>
        <p className="text-gray-600">Visualización geográfica de las direcciones de los empleados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center space-x-2">
                <Layers className="h-5 w-5 text-primary-600" />
                <h2 className="card-title">Filtros</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 inline mr-1" />
                  Filtrar por Empleado
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="input-field"
                >
                  <option value="all">Todos los empleados</option>
                  {Object.values(employees).map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.nombre_completo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Estadísticas</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total direcciones:</span>
                    <span className="font-medium">{addresses.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Visibles:</span>
                    <span className="font-medium">{filteredAddresses.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Empleados:</span>
                    <span className="font-medium">{Object.keys(employees).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header">
              <h3 className="text-sm font-medium text-gray-700">Leyenda</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Ubicación de empleado</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Ubicación activa</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="card h-96 lg:h-full min-h-96">
            <div className="card-header">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary-600" />
                <h2 className="card-title">Mapa Interactivo</h2>
              </div>
            </div>

            <InteractiveMap 
              addresses={filteredAddresses} 
              employees={employees}
              center={mapCenter}
              zoom={filteredAddresses.length > 0 ? 12 : 10}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Lista de Direcciones</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coordenadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAddresses.length > 0 ? (
                filteredAddresses.map((address, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employees[address.empleado]?.nombre_completo || 'Empleado desconocido'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {employees[address.empleado]?.puesto}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {address.latitud}, {address.longitud}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {address.direccion_completa || 'Pendiente de geolocalización'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {new Date(address.fecha_registro).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No hay direcciones registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
