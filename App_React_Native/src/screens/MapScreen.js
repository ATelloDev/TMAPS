import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { employeeAPI, addressAPI } from '../services/api';

// Coordenadas iniciales (Ciudad de México)
const INITIAL_REGION = {
  latitude: 19.4326,
  longitude: -99.1332,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapScreen() {
  const [addresses, setAddresses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [region, setRegion] = useState(INITIAL_REGION);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [employeesData, addressesData] = await Promise.all([
        employeeAPI.getAll(),
        addressAPI.getAll(),
      ]);
      setEmployees(employeesData);
      setAddresses(addressesData);

      // Si hay direcciones, centrar en la primera
      if (addressesData.length > 0) {
        const firstAddr = addressesData[0];
        setRegion({
          latitude: parseFloat(firstAddr.latitud),
          longitude: parseFloat(firstAddr.longitud),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las ubicaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const focusOnAddress = (address) => {
    setRegion({
      latitude: parseFloat(address.latitud),
      longitude: parseFloat(address.longitud),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setSelectedEmployee(address.empleado);
  };

  const getEmployeeName = (employeeId) => {
    const emp = employees.find(e => e.id === employeeId);
    return emp ? emp.nombre_completo : 'Desconocido';
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={fetchData}>
        <Text style={styles.refreshButtonText}>↻</Text>
      </TouchableOpacity>

      {/* Map */}
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {addresses.map((address) => (
          <Marker
            key={address.id}
            coordinate={{
              latitude: parseFloat(address.latitud),
              longitude: parseFloat(address.longitud),
            }}
            pinColor={selectedEmployee === address.empleado ? '#007AFF' : '#FF3B30'}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>
                  {getEmployeeName(address.empleado)}
                </Text>
                <Text style={styles.calloutAddress}>
                  {address.direccion_completa || 'Sin dirección'}
                </Text>
                <Text style={styles.calloutCoords}>
                  {parseFloat(address.latitud).toFixed(6)}, {parseFloat(address.longitud).toFixed(6)}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Address List */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          📍 Direcciones ({addresses.length})
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {addresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressChip,
                selectedEmployee === address.empleado && styles.addressChipSelected,
              ]}
              onPress={() => focusOnAddress(address)}
            >
              <Text style={styles.addressChipName} numberOfLines={1}>
                {getEmployeeName(address.empleado)}
              </Text>
              <Text style={styles.addressChipCoords}>
                {parseFloat(address.latitud).toFixed(4)}, {parseFloat(address.longitud).toFixed(4)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  map: {
    flex: 1,
  },
  callout: {
    padding: 8,
    minWidth: 150,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  calloutCoords: {
    fontSize: 11,
    color: '#999',
  },
  listContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 140,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  addressChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addressChipSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  addressChipName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    maxWidth: 150,
  },
  addressChipCoords: {
    fontSize: 12,
    color: '#666',
  },
  refreshButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: '#fff',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 10,
  },
  refreshButtonText: {
    fontSize: 22,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
