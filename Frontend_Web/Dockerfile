FROM node:20-alpine

WORKDIR /app

# Instalar bash (necesario para scripts)
RUN apk add --no-cache bash

# Copiar package.json
COPY package*.json ./
RUN npm install

# Copiar todo el proyecto
COPY . .

# Variables de entorno para React
ENV PORT=3367
ENV HOST=0.0.0.0
ENV WDS_SOCKET_HOST=0.0.0.0
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true
ENV REACT_APP_API_URL=http://localhost:8817/api

# Puerto 3367
EXPOSE 3367

# Iniciar React con variables correctas
CMD ["npm", "start"]
