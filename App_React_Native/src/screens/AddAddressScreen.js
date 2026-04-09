import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { employeeAPI, addressAPI } from '../services/api';

export default function AddAddressScreen({ route, navigation }) {
  const { employeeId } = route.params || {};
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(employeeId || null);
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await employeeAPI.getAll();
      setEmployees(data);
      if (employeeId) {
        const emp = data.find(e => e.id === employeeId);
        if (emp) {
          setSelectedEmployee(emp.id);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los empleados');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedEmployee || !latitud.trim() || !longitud.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Validar coordenadas
    const lat = parseFloat(latitud);
    const lng = parseFloat(longitud);

    if (isNaN(lat) || isNaN(lng)) {
      Alert.alert('Error', 'Las coordenadas deben ser números válidos');
      return;
    }

    if (lat < -90 || lat > 90) {
      Alert.alert('Error', 'La latitud debe estar entre -90 y 90');
      return;
    }

    if (lng < -180 || lng > 180) {
      Alert.alert('Error', 'La longitud debe estar entre -180 y 180');
      return;
    }

    setLoading(true);
    try {
      await addressAPI.create({
        empleado: selectedEmployee,
        latitud: lat.toString(),
        longitud: lng.toString(),
      });
      Alert.alert('Éxito', 'Dirección agregada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la dirección');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingEmployees) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.title}>📍 Nueva Dirección</Text>
          <Text style={styles.subtitle}>
            Asigna una ubicación al empleado
          </Text>

          {/* Selector de Empleado */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Empleado *</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.employeeSelector}
            >
              {employees.map((emp) => (
                <TouchableOpacity
                  key={emp.id}
                  style={[
                    styles.employeeChip,
                    selectedEmployee === emp.id && styles.employeeChipSelected,
                  ]}
                  onPress={() => setSelectedEmployee(emp.id)}
                >
                  <Text
                    style={[
                      styles.employeeChipText,
                      selectedEmployee === emp.id && styles.employeeChipTextSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {emp.nombre_completo}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Latitud *</Text>
              <TextInput
                style={styles.input}
                placeholder="19.4326"
                value={latitud}
                onChangeText={setLatitud}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Longitud *</Text>
              <TextInput
                style={styles.input}
                placeholder="-99.1332"
                value={longitud}
                onChangeText={setLongitud}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Coordenadas de ejemplo */}
          <View style={styles.hintCard}>
            <Text style={styles.hintTitle}>💡 Coordenadas de ejemplo:</Text>
            <Text style={styles.hintText}>Ciudad de México: 19.4326, -99.1332</Text>
            <Text style={styles.hintText}>Guadalajara: 20.6767, -103.3475</Text>
            <Text style={styles.hintText}>Monterrey: 25.6866, -100.3161</Text>
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Guardar Dirección</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  employeeSelector: {
    maxHeight: 50,
  },
  employeeChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  employeeChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  employeeChipText: {
    fontSize: 14,
    color: '#333',
    maxWidth: 150,
  },
  employeeChipTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  hintCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  submitBtn: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelBtn: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  cancelBtnText: {
    color: '#666',
    fontSize: 16,
  },
});
