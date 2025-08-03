@echo off
echo 🚀 Деплой RestMetrics Backend...

REM Остановка контейнеров
echo Остановка существующих контейнеров...
docker-compose -f docker-compose.prod.yaml down

REM Удаление старых образов
echo Удаление старых образов...
docker image prune -f

REM Сборка и запуск
echo Сборка и запуск новых контейнеров...
docker-compose -f docker-compose.prod.yaml up --build -d

echo ✅ Деплой завершен!
echo 🌐 API доступен на: http://localhost:8080
echo 📚 Swagger: http://localhost:8080/api/docs

REM Показать логи
echo 📋 Логи приложения:
docker-compose -f docker-compose.prod.yaml logs -f app
