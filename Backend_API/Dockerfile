FROM python:3.12-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el proyecto
COPY . .

# Hacer ejecutable el script de inicio
RUN chmod +x start.sh

# Puerto 8817
EXPOSE 8817

# Comando para iniciar
CMD ["./start.sh"]
