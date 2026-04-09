# Tmaps - Plataforma Integral

Este proyecto es una solución completa que incluye una aplicación móvil, un panel administrativo web y una API robusta.

## 📁 Estructura del Proyecto

El repositorio se divide en tres componentes principales:

* **`App_React_Native/`**: Aplicación móvil desarrollada con React Native y Expo.
* **`Backend_API/`**: Servicio backend desarrollado en Django.
* **`Frontend_Web/`**: Interfaz de usuario para plataforma web desarrollada en React.

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (Versión 18 o superior)
- [Docker](https://www.docker.com/) y Docker Compose
- App **Expo Go** en tu dispositivo móvil

---

## 🚀 Instalación y Puesta en Marcha

### 1. Backend y Web (Servicios con Docker)
Para levantar la API y el entorno web de forma simplificada, utiliza Docker:

```bash
docker-compose up --build
