import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View, StyleSheet } from 'react-native';

// Screens
import EmployeesScreen from '../screens/EmployeesScreen';
import EmployeeDetailScreen from '../screens/EmployeeDetailScreen';
import AddEmployeeScreen from '../screens/AddEmployeeScreen';
import AddAddressScreen from '../screens/AddAddressScreen';
import MapScreen from '../screens/MapScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Iconos simples
const TabIcon = ({ name, focused }) => (
  <View style={[styles.iconContainer, focused && styles.iconActive]}>
    <Text style={[styles.iconText, focused && styles.iconTextActive]}>
      {name === 'Employees' ? '👥' : name === 'Map' ? '🗺️' : '📍'}
    </Text>
  </View>
);

// Stack de Empleados
function EmployeesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="EmployeesList" 
        component={EmployeesScreen} 
        options={{ title: 'Empleados' }}
      />
      <Stack.Screen 
        name="EmployeeDetail" 
        component={EmployeeDetailScreen} 
        options={{ title: 'Detalle Empleado' }}
      />
      <Stack.Screen 
        name="AddEmployee" 
        component={AddEmployeeScreen} 
        options={{ title: 'Agregar Empleado' }}
      />
      <Stack.Screen 
        name="AddAddress" 
        component={AddAddressScreen} 
        options={{ title: 'Agregar Dirección' }}
      />
    </Stack.Navigator>
  );
}

// Stack de Mapa
function MapStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MapView" 
        component={MapScreen} 
        options={{ title: 'Mapa' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let name = route.name;
            return <TabIcon name={name} focused={focused} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Employees" 
          component={EmployeesStack} 
          options={{ title: 'Empleados' }}
        />
        <Tab.Screen 
          name="Map" 
          component={MapStack} 
          options={{ title: 'Mapa' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 5,
    borderRadius: 20,
  },
  iconActive: {
    backgroundColor: '#E3F2FD',
  },
  iconText: {
    fontSize: 24,
  },
  iconTextActive: {
    opacity: 1,
  },
});
