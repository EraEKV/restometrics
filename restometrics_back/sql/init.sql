-- Создание расширения для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Таблица ресторанов
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    coordinates POINT NOT NULL, -- [longitude, latitude]
    has_menu BOOLEAN DEFAULT false,
    registration_id VARCHAR(255) UNIQUE NOT NULL,
    custom_name VARCHAR(255),
    owner JSONB NOT NULL, -- {name, phone, email}
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    map_id VARCHAR(255),
    represent VARCHAR(500), -- для отображения в UI
    create_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    update_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для оптимизации поиска
CREATE INDEX idx_restaurants_name ON restaurants(name);
CREATE INDEX idx_restaurants_address ON restaurants(address);
CREATE INDEX idx_restaurants_status ON restaurants(status);
CREATE INDEX idx_restaurants_registration_id ON restaurants(registration_id);
CREATE INDEX idx_restaurants_coordinates ON restaurants USING GIST(coordinates);
CREATE INDEX idx_restaurants_owner_email ON restaurants USING GIN((owner->>'email'));
CREATE INDEX idx_restaurants_create_date ON restaurants(create_date);
CREATE INDEX idx_restaurants_represent ON restaurants(represent);

-- Функция для автоматического обновления update_date
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_date = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
