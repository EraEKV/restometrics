# RestMetrics Backend

Система прогнозирования для ресторанов с интеграцией Gemini AI и анализом погодных данных.

## Запуск проекта

### Установка зависимостей

```bash
pnpm install
```

### Настройка окружения

Создайте файл `.env` с переменными:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/restometrics_db
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key
WEATHER_API_KEY=your_weather_api_key
```

### Запуск базы данных (пока не сделано)

```bash
docker-compose up -d
```

### Запуск сервера разработки

```bash
pnpm start:dev
```

Сервер доступен по адресу: http://localhost:8080
Swagger документация: http://localhost:8080/api/docs

## Описание проекта

### Функциональность

- Прогнозирование выручки, количества заказов и посещаемости ресторанов
- Интеграция с Gemini AI для анализа популярности блюд
- Учет погодных условий при составлении прогнозов
- Анализ временных факторов (день недели, время, праздники)
- Расчет коэффициентов доверия и факторов влияния

### Технологии

- NestJS + TypeScript
- PostgreSQL + Kysely ORM
- Redis для кэширования
- Gemini AI API
- Weather API
- Swagger для документации

### Архитектура

- Модульная структура с разделением по доменам
- Dependency Injection через NestJS
- Type-safe database queries с Kysely
- Централизованная обработка ошибок
- Логирование через встроенный NestJS Logger

### API Endpoints

- `POST /api/predictions/generate` - создание прогноза
- `POST /api/auth/login` - авторизация по registration_id
- `GET /api/restaurants` - управление ресторанами

### Ограничения

В рамках данного проекта не реализованы:

- HTTP-only cookies для авторизации
- Полноценное подключение к базе данных с real-time обновлениями
- Комплексная система ролей и прав доступа
- Не было подключено еще дополнительные сервисы для прогноза (такие как события, пробки и т.д)
