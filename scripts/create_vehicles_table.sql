-- Créer la table des véhicules avec support des images
CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  plate_number VARCHAR(20) UNIQUE NOT NULL,
  color VARCHAR(50),
  seats INTEGER DEFAULT 5,
  transmission VARCHAR(20) DEFAULT 'manual',
  fuel_type VARCHAR(20) DEFAULT 'gasoline',
  price_per_day DECIMAL(10,2) NOT NULL,
  location VARCHAR(100) NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  insurance_info JSONB DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'available',
  mileage INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(type);
CREATE INDEX IF NOT EXISTS idx_vehicles_location ON vehicles(location);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate_number);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vehicles_updated_at 
    BEFORE UPDATE ON vehicles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
