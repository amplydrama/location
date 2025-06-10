-- Script d'insertion des données de test pour CarLoc Cameroun

-- Insertion des utilisateurs de test
INSERT INTO users (first_name, last_name, email, phone, password_hash, address, id_number, role) VALUES
('Jean', 'Dupont', 'jean.dupont@email.com', '+237677123456', '$2b$10$example_hash_1', 'Douala, Cameroun', '123456789', 'customer'),
('Marie', 'Ngono', 'marie.ngono@email.com', '+237699987654', '$2b$10$example_hash_2', 'Yaoundé, Cameroun', '987654321', 'customer'),
('Paul', 'Mbarga', 'paul.mbarga@email.com', '+237655111222', '$2b$10$example_hash_3', 'Bafoussam, Cameroun', '456789123', 'customer'),
('Admin', 'CarLoc', 'admin@carloc-cameroun.com', '+237600000000', '$2b$10$example_hash_admin', 'Douala, Cameroun', '000000000', 'admin');

-- Insertion des véhicules
INSERT INTO vehicles (name, brand, model, type, year, color, license_plate, price_per_day, fuel_type, transmission, seats, location, features, description) VALUES
('Toyota Corolla', 'Toyota', 'Corolla', 'Berline', 2022, 'Blanc', 'DLA-001-CM', 25000, 'Essence', 'Automatique', 5, 'Douala', 
 ARRAY['Climatisation', 'Bluetooth', 'GPS', 'Caméra de recul'], 
 'Véhicule confortable et fiable, parfait pour vos déplacements en ville et sur route.'),

('Nissan Pathfinder', 'Nissan', 'Pathfinder', 'SUV', 2021, 'Noir', 'YDE-002-CM', 45000, 'Essence', 'Automatique', 7, 'Yaoundé',
 ARRAY['4x4', 'GPS intégré', 'Caméra de recul', '7 places', 'Climatisation'],
 'SUV spacieux et puissant, idéal pour les familles et les longs trajets.'),

('Hyundai Accent', 'Hyundai', 'Accent', 'Économique', 2023, 'Rouge', 'DLA-003-CM', 20000, 'Essence', 'Manuelle', 5, 'Douala',
 ARRAY['Économique', 'Bluetooth', 'USB', 'Climatisation'],
 'Véhicule économique et pratique pour vos déplacements quotidiens.'),

('Toyota Hilux', 'Toyota', 'Hilux', 'Pick-up', 2022, 'Gris', 'BFM-004-CM', 55000, 'Diesel', 'Manuelle', 4, 'Bafoussam',
 ARRAY['4x4', 'Robuste', 'Climatisation', 'Benne'],
 'Pick-up robuste et fiable, parfait pour le transport et les terrains difficiles.'),

('Kia Picanto', 'Kia', 'Picanto', 'Citadine', 2023, 'Bleu', 'YDE-005-CM', 18000, 'Essence', 'Manuelle', 4, 'Yaoundé',
 ARRAY['Compact', 'Économique', 'Facile à garer', 'Bluetooth'],
 'Petite citadine parfaite pour la ville, économique et facile à manœuvrer.'),

('Honda CR-V', 'Honda', 'CR-V', 'SUV', 2022, 'Blanc', 'DLA-006-CM', 42000, 'Essence', 'Automatique', 5, 'Douala',
 ARRAY['AWD', 'Spacieux', 'Sécurité avancée', 'Caméra 360°'],
 'SUV moderne avec technologies avancées et excellent confort de conduite.');

-- Insertion des réservations de test
INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_days, price_per_day, total_amount, service_fee, final_amount, status, payment_method, payment_reference, payment_status, pickup_location) VALUES
(1, 1, '2024-01-15', '2024-01-18', 3, 25000, 75000, 3750, 78750, 'confirmed', 'MTN MoMo', 'MTN123456789', 'completed', 'Douala Centre'),
(2, 2, '2024-01-16', '2024-01-20', 4, 45000, 180000, 9000, 189000, 'active', 'Orange Money', 'OM987654321', 'completed', 'Yaoundé Gare'),
(3, 3, '2024-01-14', '2024-01-16', 2, 20000, 40000, 2000, 42000, 'completed', 'MTN MoMo', 'MTN555666777', 'completed', 'Douala Akwa'),
(1, 4, '2024-01-20', '2024-01-25', 5, 55000, 275000, 13750, 288750, 'pending', 'MTN MoMo', 'MTN888999000', 'pending', 'Bafoussam Centre');

-- Insertion des paiements
INSERT INTO payments (booking_id, amount, payment_method, payment_provider, transaction_id, reference_number, status, payment_date) VALUES
(1, 78750, 'MTN MoMo', 'MTN Cameroun', 'TXN123456789', 'MTN123456789', 'completed', '2024-01-15 10:30:00'),
(2, 189000, 'Orange Money', 'Orange Cameroun', 'TXN987654321', 'OM987654321', 'completed', '2024-01-16 14:15:00'),
(3, 42000, 'MTN MoMo', 'MTN Cameroun', 'TXN555666777', 'MTN555666777', 'completed', '2024-01-14 09:45:00');

-- Insertion des factures
INSERT INTO invoices (booking_id, invoice_number, amount, tax_amount, total_amount, status, pdf_path) VALUES
(1, 'INV-2024-001', 75000, 3750, 78750, 'generated', '/invoices/INV-2024-001.pdf'),
(2, 'INV-2024-002', 180000, 9000, 189000, 'generated', '/invoices/INV-2024-002.pdf'),
(3, 'INV-2024-003', 40000, 2000, 42000, 'generated', '/invoices/INV-2024-003.pdf');

-- Insertion des avis clients
INSERT INTO reviews (booking_id, user_id, vehicle_id, rating, comment) VALUES
(1, 1, 1, 5, 'Excellent service ! Véhicule propre et en parfait état. Je recommande vivement.'),
(3, 3, 3, 4, 'Très bon rapport qualité-prix. Véhicule économique et fiable pour mes déplacements.'),
(2, 2, 2, 5, 'SUV spacieux et confortable. Parfait pour notre voyage en famille. Service impeccable.');

-- Mise à jour des statuts des véhicules
UPDATE vehicles SET status = 'rented' WHERE id IN (2); -- Nissan Pathfinder actuellement loué
UPDATE vehicles SET status = 'available' WHERE id NOT IN (2);
