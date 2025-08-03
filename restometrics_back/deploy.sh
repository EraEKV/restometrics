#!/bin/bash

echo "🚀 Деплой RestMetrics Backend..."

# Остановка контейнеров
echo "Остановка существующих контейнеров..."
docker-compose -f docker-compose.prod.yaml down

# Удаление старых образов
echo "Удаление старых образов..."
docker image prune -f

# Сборка и запуск
echo "Сборка и запуск новых контейнеров..."
docker-compose -f docker-compose.prod.yaml up --build -d

echo "✅ Деплой завершен!"
echo "🌐 API доступен на: http://localhost:8080"
echo "📚 Swagger: http://localhost:8080/api/docs"

# Показать логи
echo "📋 Логи приложения:"
docker-compose -f docker-compose.prod.yaml logs -f app
