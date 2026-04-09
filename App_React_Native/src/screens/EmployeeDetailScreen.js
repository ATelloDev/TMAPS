import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { employeeAPI, addressAPI } from '../services/api';

export default function EmployeeDetailScreen({ route, navigation }) {
  const { employee: initialEmployee } = route.params;
  const [employee, setEmployee] = useState(initialEmployee);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [employeeData, addressesData] = await Promise.all([
        employeeAPI.getById(employee.id),
        addressAPI.getByEmployee(employee.id),
      ]);
      setEmployee(employeeData);
      setAddresses(addressesData);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la información');
    } finally {
      setLoading(false);
    }
  }, [employee.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleDeleteAddress = (addressId) => {
    Alert.alert(
      'Eliminar Dirección',
      '¿Estás seguro de eliminar esta dirección?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await addressAPI.delete(addressId);
              setAddresses(addresses.filter(a => a.id !== addressId));
              Alert.alert('Éxito', 'Dirección eliminada');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la dirección');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {employee.nombre_completo.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{employee.nombre_completo}</Text>
        <Text style={styles.position}>{employee.puesto}</Text>
        <Text style={styles.date}>
          Registrado: {new Date(employee.fecha_registro).toLocaleDateString('es-ES')}
        </Text>
      </View>

      {/* Addresses Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📍 Direcciones</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddAddress', { employeeId: employee.id })}
          >
            <Text style={styles.addBtnText}>+ Agregar</Text>
          </TouchableOpacity>
        </View>

        {addresses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No hay direcciones registradas</Text>
          </View>
        ) : (
          addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressInfo}>
                <Text style={styles.addressText}>
                  {address.direccion_completa || 'Sin dirección completa'}
                </Text>
                <Text style={styles.coordinates}>
                  📍 {parseFloat(address.latitud).toFixed(6)}, {parseFloat(address.longitud).toFixed(6)}
                </Text>
                <Text style={styles.addressDate}>
                  {new Date(address.fecha_registro).toLocaleDateString('es-ES')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteAddressBtn}
                onPress={() => handleDeleteAddress(address.id)}
              >
                <Text style={styles.deleteAddressText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    backgroundColor: '#007AFF',
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  position: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressInfo: {
    flex: 1,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  addressDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteAddressBtn: {
    padding: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    marginLeft: 12,
  },
  deleteAddressText: {
    fontSize: 16,
  },
});
