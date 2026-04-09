import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { employeeAPI, addressAPI } from '../services/api';

export default function EmployeesScreen({ navigation }) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [addressCount, setAddressCount] = useState({});

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [employeesData, addressesData] = await Promise.all([
        employeeAPI.getAll(),
        addressAPI.getAll(),
      ]);

      // Contar direcciones por empleado
      const count = {};
      addressesData.forEach(addr => {
        const empId = addr.empleado;
        count[empId] = (count[empId] || 0) + 1;
      });

      setEmployees(employeesData);
      setFilteredEmployees(employeesData);
      setAddressCount(count);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los empleados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = employees.filter(emp =>
        emp.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.puesto.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchTerm, employees]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleDelete = (id, name) => {
    Alert.alert(
      'Eliminar Empleado',
      `¿Estás seguro de eliminar a ${name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await employeeAPI.delete(id);
              setEmployees(employees.filter(emp => emp.id !== id));
              Alert.alert('Éxito', 'Empleado eliminado');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el empleado');
            }
          },
        },
      ]
    );
  };

  const renderEmployee = ({ item }) => (
    <TouchableOpacity
      style={styles.employeeCard}
      onPress={() => navigation.navigate('EmployeeDetail', { employee: item })}
    >
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.nombre_completo}</Text>
        <Text style={styles.employeePosition}>{item.puesto}</Text>
        <View style={styles.addressBadge}>
          <Text style={styles.addressCount}>
            📍 {addressCount[item.id] || 0} direcciones
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.addAddressBtn}
          onPress={() => navigation.navigate('AddAddress', { employeeId: item.id })}
        >
          <Text style={styles.addAddressText}>+ 📍</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id, item.nombre_completo)}
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar empleados..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEmployee')}
        >
          <Text style={styles.addButtonText}>+ Agregar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.count}>
        Total: {filteredEmployees.length} empleados
      </Text>

      <FlatList
        data={filteredEmployees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderEmployee}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {searchTerm ? 'No se encontraron resultados' : 'No hay empleados registrados'}
            </Text>
          </View>
        }
      />
    </View>
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
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  count: {
    padding: 12,
    paddingHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
  list: {
    padding: 16,
  },
  employeeCard: {
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
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  employeePosition: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  addressBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  addressCount: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  addAddressBtn: {
    padding: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  addAddressText: {
    fontSize: 16,
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  deleteText: {
    fontSize: 16,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
