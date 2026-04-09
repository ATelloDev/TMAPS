#!/bin/bash

echo "=================================="
echo "   Tmaps Backend - Iniciando"
echo "=================================="
echo ""

# Run migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Create superuser if needed (optional)
# python manage.py shell -c "from django.contrib.auth.models import User; User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@example.com', 'admin123')"

# Start server
echo ""
echo "Starting Django server on port 8817..."
python manage.py runserver 0.0.0.0:8817
