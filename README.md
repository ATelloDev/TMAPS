# Tmaps - App Expo

App móvil con React Native + Expo.

## Requisitos

- Node.js 18+
- App **Expo Go** en tu celular


## Backend con Docker (opcional)

Para levantar la API y el web:

```bash
docker-compose up --build
```

- API: http://localhost:8817
- Web: http://localhost:3367

## Estructura

- `App_React_Native/` - App Expo
- `Backend_API/` - API Django
- `Frontend_Web/` - Web React

## Correr la app

```bash
cd App_React_Native
npm install
npx expo start
```

Escanea el QR con **Expo Go**.

