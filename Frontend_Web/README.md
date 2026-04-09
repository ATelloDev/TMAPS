# TMaps Frontend

Frontend moderno y minimalista para el sistema de gestión de empleados y direcciones TMaps.

## Características

- 🎨 **Diseño Minimalista**: Interfaz limpia y profesional con Tailwind CSS
- 📍 **Gestión Geográfica**: Registro y visualización de direcciones con coordenadas
- 👥 **Gestión de Empleados**: CRUD completo de empleados
- 🗺️ **Visualización en Mapa**: Vista interactiva de todas las ubicaciones
- 📱 **Responsive Design**: Optimizado para todos los dispositivos
- ⚡ **React 18**: Construido con las últimas tecnologías

## Tecnologías

- React 18
- React Router DOM
- Tailwind CSS
- Lucide React (Iconos)
- Axios (Cliente HTTP)
- Leaflet (Mapas - preparado para integración)

## Instalación

1. Navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── components/
│   └── Navigation.js          # Navegación principal
├── pages/
│   ├── Dashboard.js           # Panel principal
│   ├── Employees.js           # Lista de empleados
│   ├── EmployeeDetail.js      # Detalle de empleado
│   ├── AddEmployee.js         # Agregar empleado
│   ├── AddAddress.js          # Agregar dirección
│   └── MapView.js             # Vista de mapa
├── services/
│   └── api.js                 # Cliente API
├── App.js                     # Aplicación principal
├── index.css                  # Estilos globales
└── index.js                   # Punto de entrada
```

## Funcionalidades

### Dashboard
- Estadísticas en tiempo real
- Empleados recientes
- Acciones rápidas

### Gestión de Empleados
- Listado con búsqueda
- Agregar nuevos empleados
- Ver detalles completos
- Eliminar empleados

### Gestión de Direcciones
- Agregar coordenadas GPS
- Geolocalización automática
- Integración con Google Maps
- Múltiples direcciones por empleado

### Mapa Interactivo
- Visualización de todas las direcciones
- Filtros por empleado
- Estadísticas de cobertura
- Vista de lista detallada

## API Integration

El frontend se conecta con el backend Django REST Framework en:

- `http://localhost:8000/api-mike/empleados/`
- `http://localhost:8000/api-mike/direcciones/`

## Configuración

El archivo `package.json` incluye un proxy configurado hacia el backend Django para facilitar el desarrollo.

## Diseño

- **Paleta de Colores**: Azul primario (#0ea5e9) con grises neutrales
- **Tipografía**: Inter para máxima legibilidad
- **Sombras**: Suaves y modernas para dar profundidad
- **Iconografía**: Lucide React para consistencia visual
