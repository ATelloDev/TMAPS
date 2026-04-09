// Tmaps API Service
// Consume la API Django de crispy-enigma

const API_BASE_URL = 'http://192.168.68.103:8817/api';

// Para emulador Android usar: 'http://10.0.2.2:8000/api'
// Para iOS simulator usar: 'http://localhost:8000/api'
// Para dispositivo físico usar IP de tu computadora

class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const fetchWithTimeout = async (url, options, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Empleados API
export const employeeAPI = {
  getAll: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/empleados/`, {
      method: 'GET',
    });
    if (!response.ok) throw new APIError('Error fetching employees', response.status);
    return await response.json();
  },

  getById: async (id) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/empleados/${id}/`, {
      method: 'GET',
    });
    if (!response.ok) throw new APIError('Error fetching employee', response.status);
    return await response.json();
  },

  create: async (data) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/empleados/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new APIError('Error creating employee', response.status);
    return await response.json();
  },

  delete: async (id) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/empleados/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new APIError('Error deleting employee', response.status);
    return response.status === 204 ? null : await response.json();
  },
};

// Direcciones API
export const addressAPI = {
  getAll: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/direcciones/`, {
      method: 'GET',
    });
    if (!response.ok) throw new APIError('Error fetching addresses', response.status);
    return await response.json();
  },

  create: async (data) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/direcciones/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new APIError('Error creating address', response.status);
    return await response.json();
  },

  delete: async (id) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/direcciones/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new APIError('Error deleting address', response.status);
    return response.status === 204 ? null : await response.json();
  },

  getByEmployee: async (employeeId) => {
    const allAddresses = await addressAPI.getAll();
    return allAddresses.filter(addr => addr.empleado === employeeId);
  },
};

export default { employeeAPI, addressAPI };
