-- Script complet pour créer le système de chat avec données enrichies
-- Ce script crée les tables ET insère les données de test

-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS chat_metrics CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS chat_conversations CASCADE;
DROP TABLE IF EXISTS chat_participants CASCADE;

-- ===== CRÉATION DES TABLES =====

-- Table des participants (clients et agents)
CREATE TABLE chat_participants (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL UNIQUE,
    user_name VARCHAR(200) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('client', 'agent')),
    email VARCHAR(255),
    phone VARCHAR(20),
    socket_id VARCHAR(100),
    is_online BOOLEAN DEFAULT false,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des conversations
CREATE TABLE chat_conversations (
    id SERIAL PRIMARY KEY,
    conversation_id VARCHAR(100) UNIQUE NOT NULL,
    client_id VARCHAR(100) NOT NULL,
    agent_id VARCHAR(100),
    client_name VARCHAR(200) NOT NULL,
    agent_name VARCHAR(200),
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'ended', 'archived')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    category VARCHAR(50) DEFAULT 'general',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des messages
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    message_id VARCHAR(100) UNIQUE NOT NULL,
    conversation_id VARCHAR(100) NOT NULL,
    sender_id VARCHAR(100) NOT NULL,
    sender_name VARCHAR(200) NOT NULL,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('client', 'agent', 'system')),
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    file_url VARCHAR(500),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des sessions de chat
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    participant_id VARCHAR(100) NOT NULL,
    socket_id VARCHAR(100) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    disconnected_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Table des métriques de chat
CREATE TABLE chat_metrics (
    id SERIAL PRIMARY KEY,
    conversation_id VARCHAR(100) NOT NULL,
    response_time_seconds INTEGER,
    resolution_time_seconds INTEGER,
    message_count INTEGER DEFAULT 0,
    agent_message_count INTEGER DEFAULT 0,
    client_message_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX idx_chat_participants_socket_id ON chat_participants(socket_id);
CREATE INDEX idx_chat_participants_online ON chat_participants(is_online);

CREATE INDEX idx_chat_conversations_client_id ON chat_conversations(client_id);
CREATE INDEX idx_chat_conversations_agent_id ON chat_conversations(agent_id);
CREATE INDEX idx_chat_conversations_status ON chat_conversations(status);
CREATE INDEX idx_chat_conversations_started_at ON chat_conversations(started_at);

CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

CREATE INDEX idx_chat_sessions_participant_id ON chat_sessions(participant_id);
CREATE INDEX idx_chat_sessions_socket_id ON chat_sessions(socket_id);
CREATE INDEX idx_chat_sessions_active ON chat_sessions(is_active);

-- ===== INSERTION DES DONNÉES ENRICHIES =====

-- Insérer les agents avec profils variés
INSERT INTO chat_participants (user_id, user_name, user_type, email, is_online) VALUES
('agent_001', 'Marie Tagne', 'agent', 'marie.tagne@carloc-cameroun.com', true),
('agent_002', 'Paul Kouam', 'agent', 'paul.kouam@carloc-cameroun.com', true),
('agent_003', 'Fatima Bello', 'agent', 'fatima.bello@carloc-cameroun.com', false),
('agent_004', 'Jean Mballa', 'agent', 'jean.mballa@carloc-cameroun.com', true),
('agent_005', 'Aminata Diallo', 'agent', 'aminata.diallo@carloc-cameroun.com', false),
('agent_006', 'Pierre Nkomo', 'agent', 'pierre.nkomo@carloc-cameroun.com', true),
('agent_007', 'Grace Fouda', 'agent', 'grace.fouda@carloc-cameroun.com', false);

-- Insérer des clients variés
INSERT INTO chat_participants (user_id, user_name, user_type, email, phone) VALUES
('client_001', 'Alain Mbarga', 'client', 'alain.mbarga@gmail.com', '+237670123456'),
('client_002', 'Sophie Ndongo', 'client', 'sophie.ndongo@yahoo.fr', '+237680234567'),
('client_003', 'Dr. Michel Atangana', 'client', 'michel.atangana@hospital.cm', '+237690345678'),
('client_004', 'Mme Josephine Eyenga', 'client', 'j.eyenga@orange.cm', '+237650456789'),
('client_005', 'Thomas Biya', 'client', 'thomas.biya@gmail.com', '+237670567890'),
('client_006', 'Claudine Essomba', 'client', 'claudine.essomba@yahoo.fr', '+237680678901'),
('client_007', 'Robert Manga', 'client', 'robert.manga@sabc.cm', '+237690789012'),
('client_008', 'Estelle Fokou', 'client', 'estelle.fokou@gmail.com', '+237650890123'),
('client_009', 'David Tchoumi', 'client', 'david.tchoumi@total.cm', '+237670901234'),
('client_010', 'Brigitte Onana', 'client', 'brigitte.onana@yahoo.fr', '+237680012345'),
('client_011', 'François Belibi', 'client', 'francois.belibi@gmail.com', '+237690123456'),
('client_012', 'Nadine Mekongo', 'client', 'nadine.mekongo@yahoo.fr', '+237650234567'),
('client_013', 'Eric Mvondo', 'client', 'eric.mvondo@gmail.com', '+237670345678'),
('client_014', 'Sylvie Abena', 'client', 'sylvie.abena@yahoo.fr', '+237680456789'),
('client_015', 'Patrick Owona', 'client', 'patrick.owona@gmail.com', '+237690567890');

-- Insérer des conversations avec différents statuts et dates
INSERT INTO chat_conversations (conversation_id, client_id, agent_id, client_name, agent_name, status, priority, category, started_at, ended_at, rating, feedback) VALUES
-- Conversations terminées avec notes variées (derniers 7 jours)
('conv_001', 'client_001', 'agent_001', 'Alain Mbarga', 'Marie Tagne', 'ended', 'normal', 'reservation', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '25 minutes', 5, 'Service excellent, très professionnel'),
('conv_002', 'client_002', 'agent_002', 'Sophie Ndongo', 'Paul Kouam', 'ended', 'normal', 'information', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '15 minutes', 4, 'Bon service, réponses rapides'),
('conv_003', 'client_003', 'agent_001', 'Dr. Michel Atangana', 'Marie Tagne', 'ended', 'high', 'reservation', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '30 minutes', 5, 'Parfait pour mes besoins professionnels'),
('conv_004', 'client_004', 'agent_003', 'Mme Josephine Eyenga', 'Fatima Bello', 'ended', 'urgent', 'probleme_technique', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days' + INTERVAL '45 minutes', 3, 'Problème résolu mais temps d''attente long'),
('conv_005', 'client_005', 'agent_002', 'Thomas Biya', 'Paul Kouam', 'ended', 'normal', 'information', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '20 minutes', 4, 'Informations claires et précises'),
('conv_006', 'client_006', 'agent_007', 'Claudine Essomba', 'Grace Fouda', 'ended', 'normal', 'reservation', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days' + INTERVAL '60 minutes', 2, 'Agent peu expérimenté, beaucoup d''attente'),
('conv_007', 'client_007', 'agent_004', 'Robert Manga', 'Jean Mballa', 'ended', 'high', 'reservation', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days' + INTERVAL '35 minutes', 4, 'Bon service pour notre entreprise'),
('conv_008', 'client_008', 'agent_001', 'Estelle Fokou', 'Marie Tagne', 'ended', 'normal', 'information', NOW() - INTERVAL '1 day' - INTERVAL '2 hours', NOW() - INTERVAL '1 day' - INTERVAL '1 hour', 5, 'Très satisfaite du service'),

-- Conversations actives
('conv_009', 'client_009', 'agent_002', 'David Tchoumi', 'Paul Kouam', 'active', 'high', 'reservation', NOW() - INTERVAL '30 minutes', NULL, NULL, NULL),
('conv_010', 'client_010', 'agent_004', 'Brigitte Onana', 'Jean Mballa', 'active', 'normal', 'information', NOW() - INTERVAL '15 minutes', NULL, NULL, NULL),
('conv_011', 'client_011', 'agent_001', 'François Belibi', 'Marie Tagne', 'active', 'normal', 'probleme_technique', NOW() - INTERVAL '45 minutes', NULL, NULL, NULL),

-- Conversations en attente
('conv_012', 'client_012', NULL, 'Nadine Mekongo', NULL, 'waiting', 'normal', 'information', NOW() - INTERVAL '5 minutes', NULL, NULL, NULL),
('conv_013', 'client_013', NULL, 'Eric Mvondo', NULL, 'waiting', 'low', 'general', NOW() - INTERVAL '2 minutes', NULL, NULL, NULL),

-- Conversations archivées (plus anciennes)
('conv_014', 'client_014', 'agent_005', 'Sylvie Abena', 'Aminata Diallo', 'ended', 'normal', 'reservation', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days' + INTERVAL '40 minutes', 4, 'Service correct'),
('conv_015', 'client_015', 'agent_006', 'Patrick Owona', 'Pierre Nkomo', 'ended', 'normal', 'information', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days' + INTERVAL '50 minutes', 3, 'Peut mieux faire'),

-- Conversations abandonnées
('conv_016', 'client_001', NULL, 'Alain Mbarga', NULL, 'ended', 'normal', 'general', NOW() - INTERVAL '3 days' - INTERVAL '2 hours', NOW() - INTERVAL '3 days' - INTERVAL '2 hours' + INTERVAL '2 minutes', NULL, NULL),
('conv_017', 'client_005', NULL, 'Thomas Biya', NULL, 'ended', 'low', 'information', NOW() - INTERVAL '5 days' - INTERVAL '1 hour', NOW() - INTERVAL '5 days' - INTERVAL '1 hour' + INTERVAL '1 minute', NULL, NULL);

-- Insérer des messages pour les conversations
INSERT INTO chat_messages (message_id, conversation_id, sender_id, sender_name, sender_type, content, created_at) VALUES
-- Messages pour conv_001 (Alain Mbarga - Marie Tagne)
('msg_001_001', 'conv_001', 'client_001', 'Alain Mbarga', 'client', 'Bonjour, je souhaite louer une voiture pour ce weekend', NOW() - INTERVAL '1 day'),
('msg_001_002', 'conv_001', 'agent_001', 'Marie Tagne', 'agent', 'Bonjour M. Mbarga ! Je serais ravie de vous aider. Quel type de véhicule recherchez-vous ?', NOW() - INTERVAL '1 day' + INTERVAL '1 minute'),
('msg_001_003', 'conv_001', 'client_001', 'Alain Mbarga', 'client', 'Une berline confortable pour 4 personnes, de préférence automatique', NOW() - INTERVAL '1 day' + INTERVAL '2 minutes'),
('msg_001_004', 'conv_001', 'agent_001', 'Marie Tagne', 'agent', 'Parfait ! J''ai une Toyota Camry automatique disponible. Voulez-vous que je vous envoie les détails ?', NOW() - INTERVAL '1 day' + INTERVAL '3 minutes'),
('msg_001_005', 'conv_001', 'client_001', 'Alain Mbarga', 'client', 'Oui s''il vous plaît, et le tarif aussi', NOW() - INTERVAL '1 day' + INTERVAL '4 minutes'),
('msg_001_006', 'conv_001', 'agent_001', 'Marie Tagne', 'agent', 'La Toyota Camry est à 35 000 FCFA/jour. Assurance incluse. Quand souhaitez-vous la récupérer ?', NOW() - INTERVAL '1 day' + INTERVAL '5 minutes'),

-- Messages pour conv_002 (Sophie Ndongo - Paul Kouam)
('msg_002_001', 'conv_002', 'client_002', 'Sophie Ndongo', 'client', 'Salut, quels sont vos horaires d''ouverture ?', NOW() - INTERVAL '2 days'),
('msg_002_002', 'conv_002', 'agent_002', 'Paul Kouam', 'agent', 'Bonjour ! Nous sommes ouverts de 7h à 19h du lundi au samedi, et de 8h à 17h le dimanche', NOW() - INTERVAL '2 days' + INTERVAL '2 minutes'),
('msg_002_003', 'conv_002', 'client_002', 'Sophie Ndongo', 'client', 'Merci ! Et pour les réservations de dernière minute ?', NOW() - INTERVAL '2 days' + INTERVAL '3 minutes'),
('msg_002_004', 'conv_002', 'agent_002', 'Paul Kouam', 'agent', 'Nous acceptons les réservations jusqu''à 2h avant, sous réserve de disponibilité', NOW() - INTERVAL '2 days' + INTERVAL '4 minutes'),

-- Messages pour conv_003 (Dr. Michel Atangana - Marie Tagne)
('msg_003_001', 'conv_003', 'client_003', 'Dr. Michel Atangana', 'client', 'Bonjour, j''ai besoin d''un véhicule haut de gamme pour des déplacements professionnels', NOW() - INTERVAL '3 days'),
('msg_003_002', 'conv_003', 'agent_001', 'Marie Tagne', 'agent', 'Bonjour Docteur ! Nous avons une Mercedes Classe E et une BMW Série 5 disponibles. Laquelle vous intéresse ?', NOW() - INTERVAL '3 days' + INTERVAL '1 minute'),
('msg_003_003', 'conv_003', 'client_003', 'Dr. Michel Atangana', 'client', 'La Mercedes m''intéresse. Quel est le tarif et les conditions ?', NOW() - INTERVAL '3 days' + INTERVAL '2 minutes'),
('msg_003_004', 'conv_003', 'agent_001', 'Marie Tagne', 'agent', 'La Mercedes Classe E est à 75 000 FCFA/jour. Chauffeur disponible en option pour 25 000 FCFA/jour', NOW() - INTERVAL '3 days' + INTERVAL '3 minutes'),

-- Messages pour conversations actives
('msg_009_001', 'conv_009', 'client_009', 'David Tchoumi', 'client', 'Bonjour, je représente Total Energies. Nous avons besoin de plusieurs véhicules pour une mission', NOW() - INTERVAL '30 minutes'),
('msg_009_002', 'conv_009', 'agent_002', 'Paul Kouam', 'agent', 'Bonjour M. Tchoumi ! Combien de véhicules et pour quelle durée ?', NOW() - INTERVAL '28 minutes'),
('msg_009_003', 'conv_009', 'client_009', 'David Tchoumi', 'client', '5 véhicules 4x4 pour 2 semaines, mission dans le Nord', NOW() - INTERVAL '25 minutes'),

('msg_010_001', 'conv_010', 'client_010', 'Brigitte Onana', 'client', 'Bonsoir, acceptez-vous les cartes de crédit ?', NOW() - INTERVAL '15 minutes'),
('msg_010_002', 'conv_010', 'agent_004', 'Jean Mballa', 'agent', 'Bonsoir ! Oui, nous acceptons Visa et Mastercard, ainsi que les paiements mobiles', NOW() - INTERVAL '13 minutes'),

('msg_011_001', 'conv_011', 'client_011', 'François Belibi', 'client', 'J''ai un problème avec ma réservation en ligne, le site plante', NOW() - INTERVAL '45 minutes'),
('msg_011_002', 'conv_011', 'agent_001', 'Marie Tagne', 'agent', 'Je vais vérifier cela immédiatement. Pouvez-vous me donner votre numéro de réservation ?', NOW() - INTERVAL '43 minutes'),

-- Messages pour conversations en attente
('msg_012_001', 'conv_012', 'client_012', 'Nadine Mekongo', 'client', 'Bonjour, j''aimerais connaître vos tarifs pour une location longue durée', NOW() - INTERVAL '5 minutes'),
('msg_013_001', 'conv_013', 'client_013', 'Eric Mvondo', 'client', 'Salut, vous livrez les voitures à domicile ?', NOW() - INTERVAL '2 minutes');

-- Insérer des métriques pour les conversations terminées
INSERT INTO chat_metrics (conversation_id, response_time_seconds, resolution_time_seconds, message_count, agent_message_count, client_message_count) VALUES
('conv_001', 60, 1500, 6, 3, 3),
('conv_002', 120, 900, 4, 2, 2),
('conv_003', 60, 1800, 4, 2, 2),
('conv_004', 180, 2700, 8, 4, 4),
('conv_005', 90, 1200, 4, 2, 2),
('conv_006', 300, 3600, 6, 3, 3),
('conv_007', 75, 2100, 6, 3, 3),
('conv_008', 45, 900, 4, 2, 2),
('conv_014', 150, 2400, 5, 3, 2),
('conv_015', 200, 3000, 6, 3, 3);

-- Insérer des sessions actives
INSERT INTO chat_sessions (session_id, participant_id, socket_id, ip_address, connected_at, is_active) VALUES
('session_001', 'agent_001', 'socket_agent_001', '192.168.1.10', NOW() - INTERVAL '2 hours', true),
('session_002', 'agent_002', 'socket_agent_002', '192.168.1.11', NOW() - INTERVAL '1 hour', true),
('session_003', 'agent_004', 'socket_agent_004', '192.168.1.12', NOW() - INTERVAL '30 minutes', true),
('session_004', 'client_009', 'socket_client_009', '41.202.219.45', NOW() - INTERVAL '30 minutes', true),
('session_005', 'client_010', 'socket_client_010', '41.202.219.46', NOW() - INTERVAL '15 minutes', true),
('session_006', 'client_011', 'socket_client_011', '41.202.219.47', NOW() - INTERVAL '45 minutes', true);

-- Afficher un résumé des données créées
SELECT 'Système de chat configuré avec succès !' as message;

SELECT 'RÉSUMÉ DES DONNÉES CRÉÉES:' as info;

SELECT 
    'Agents: ' || COUNT(*) as agents_count
FROM chat_participants WHERE user_type = 'agent';

SELECT 
    'Clients: ' || COUNT(*) as clients_count  
FROM chat_participants WHERE user_type = 'client';

SELECT 
    'Conversations totales: ' || COUNT(*) as conversations_total
FROM chat_conversations;

SELECT 
    'Conversations terminées: ' || COUNT(*) as conversations_ended
FROM chat_conversations WHERE status = 'ended';

SELECT 
    'Conversations actives: ' || COUNT(*) as conversations_active
FROM chat_conversations WHERE status = 'active';

SELECT 
    'Messages totaux: ' || COUNT(*) as messages_total
FROM chat_messages;

SELECT 
    'Note moyenne: ' || ROUND(AVG(rating), 2) as average_rating
FROM chat_conversations WHERE rating IS NOT NULL;

SELECT 'Analytics prêtes à être consultées sur /admin/chat/analytics' as final_message;
