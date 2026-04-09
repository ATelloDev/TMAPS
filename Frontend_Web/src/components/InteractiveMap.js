import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export function InteractiveMap({ addresses, employees, center = [19.4326, -99.1332], zoom = 11 }) {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Inicializar el mapa
    const map = window.L.map(mapRef.current).setView(center, zoom);
    
    // Añadir capa de tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Añadir marcadores para cada dirección
    const markers = [];
    addresses.forEach((address, index) => {
      const employee = employees[address.empleado];
      if (!employee) return;

      const lat = parseFloat(address.latitud);
      const lng = parseFloat(address.longitud);
      
      if (isNaN(lat) || isNaN(lng)) return;

      const marker = window.L.marker([lat, lng]).addTo(map);
      
      const popupContent = `
        <div style="min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #0ea5e9; font-weight: 600;">
            ${employee.nombre_completo}
          </h4>
          <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
            ${employee.puesto}
          </p>
          <p style="margin: 4px 0; color: #374151; font-size: 12px;">
            <strong>Coordenadas:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}
          </p>
          ${address.direccion_completa ? `
            <p style="margin: 4px 0; color: #374151; font-size: 12px;">
              <strong>Dirección:</strong> ${address.direccion_completa}
            </p>
          ` : ''}
          <a href="https://www.google.com/maps?q=${lat},${lng}" 
             target="_blank" 
             style="display: inline-block; margin-top: 8px; padding: 4px 8px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">
            Ver en Google Maps
          </a>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markers.push(marker);

      // Añadir evento de clic
      marker.on('click', () => {
        setSelectedAddress({ ...address, employee });
      });
    });

    // Ajustar vista para mostrar todos los marcadores
    if (markers.length > 0) {
      const group = new window.L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    setMapLoaded(true);

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [addresses, employees, center, zoom]);

  const centerOnUser = () => {
    if (navigator.geolocation && window.L) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (mapRef.current && mapRef.current._leaflet_map) {
            mapRef.current._leaflet_map.setView([latitude, longitude], 15);
            
            // Añadir marcador de ubicación actual
            window.L.marker([latitude, longitude])
              .addTo(mapRef.current._leaflet_map)
              .bindPopup('Tu ubicación actual')
              .openPopup();
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('No se pudo obtener tu ubicación actual');
        }
      );
    }
  };

  return (
    <div className="relative">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando mapa...</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="w-full h-96 lg:h-full min-h-96 rounded-lg"
        style={{ minHeight: '400px' }}
      />
      
      <button
        onClick={centerOnUser}
        className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 hover:bg-gray-50 transition-colors z-20"
        title="Centrar en mi ubicación"
      >
        <Navigation className="h-4 w-4 text-gray-700" />
      </button>

      {selectedAddress && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-4 max-w-sm z-20">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-900">
              {selectedAddress.employee?.nombre_completo}
            </h4>
            <button
              onClick={() => setSelectedAddress(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            {selectedAddress.employee?.puesto}
          </p>
          <p className="text-xs text-gray-500">
            {selectedAddress.direccion_completa || 'Geolocalización pendiente'}
          </p>
        </div>
      )}
    </div>
  );
}
