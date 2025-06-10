-- Script pour corriger et créer les tables de chat
-- Ce script vérifie et crée les tables manquantes

-- Supprimer les tables existantes si elles existent (pour un redémarrage propre)
DROP TABLE IF EXISTS chat_metrics CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS chat_conversations CASCADE;
DROP TABLE IF EXISTS chat_participants CASCADE;

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(conversation_id) ON DELETE CASCADE
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(conversation_id) ON DELETE CASCADE
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

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_chat_participants_updated_at 
    BEFORE UPDATE ON chat_participants 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at 
    BEFORE UPDATE ON chat_conversations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insérer des agents avec des profils camerounais
INSERT INTO chat_participants (user_id, user_name, user_type, email, is_online) VALUES
('agent_001', 'Marie Dubois', 'agent', 'marie.dubois@carloc-cameroun.com', true),
('agent_002', 'Jean Kamga', 'agent', 'jean.kamga@carloc-cameroun.com', false),
('agent_003', 'Fatima Nkomo', 'agent', 'fatima.nkomo@carloc-cameroun.com', true),
('agent_004', 'Paul Mbarga', 'agent', 'paul.mbarga@carloc-cameroun.com', true),
('agent_005', 'Aminata Sow', 'agent', 'aminata.sow@carloc-cameroun.com', false),
('agent_006', 'Claude Essomba', 'agent', 'claude.essomba@carloc-cameroun.com', true),
('agent_007', 'Raissa Tchoumi', 'agent', 'raissa.tchoumi@carloc-cameroun.com', false);

-- Insérer des clients de test
INSERT INTO chat_participants (user_id, user_name, user_type, email, phone, is_online) VALUES
('client_001', 'Alain Fouda', 'client', 'alain.fouda@gmail.com', '+237670123456', false),
('client_002', 'Sylvie Manga', 'client', 'sylvie.manga@yahoo.fr', '+237680234567', true),
('client_003', 'Ibrahim Mahamat', 'client', 'ibrahim.mahamat@hotmail.com', '+237690345678', false),
('client_004', 'Grace Biya', 'client', 'grace.biya@gmail.com', '+237650456789', true),
('client_005', 'Roger Milla', 'client', 'roger.milla@yahoo.fr', '+237660567890', false);

-- Insérer des conversations de test avec des données réalistes
INSERT INTO chat_conversations (conversation_id, client_id, agent_id, client_name, agent_name, status, category, started_at, ended_at, rating, feedback) VALUES
('conv_001', 'client_001', 'agent_001', 'Alain Fouda', 'Marie Dubois', 'ended', 'reservation', '2024-01-08 09:15:00', '2024-01-08 09:45:00', 5, 'Service excellent, très professionnel'),
('conv_002', 'client_002', 'agent_002', 'Sylvie Manga', 'Jean Kamga', 'ended', 'information', '2024-01-08 10:30:00', '2024-01-08 10:50:00', 4, 'Bon service, réponses rapides'),
('conv_003', 'client_003', 'agent_003', 'Ibrahim Mahamat', 'Fatima Nkomo', 'ended', 'probleme', '2024-01-08 11:00:00', '2024-01-08 11:30:00', 3, 'Problème résolu mais temps d''attente long'),
('conv_004', 'client_004', 'agent_001', 'Grace Biya', 'Marie Dubois', 'active', 'reservation', '2024-01-08 14:00:00', NULL, NULL, NULL),
('conv_005', 'client_005', 'agent_004', 'Roger Milla', 'Paul Mbarga', 'waiting', 'information', '2024-01-08 14:30:00', NULL, NULL, NULL);

-- Insérer des messages de test
INSERT INTO chat_messages (message_id, conversation_id, sender_id, sender_name, sender_type, content, created_at) VALUES
-- Conversation 1
('msg_001', 'conv_001', 'client_001', 'Alain Fouda', 'client', 'Bonjour, je souhaite louer une voiture pour ce weekend', '2024-01-08 09:15:00'),
('msg_002', 'conv_001', 'agent_001', 'Marie Dubois', 'agent', 'Bonjour M. Fouda ! Je serais ravie de vous aider. Quel type de véhicule recherchez-vous ?', '2024-01-08 09:16:00'),
('msg_003', 'conv_001', 'client_001', 'Alain Fouda', 'client', 'Une berline confortable pour 4 personnes, du vendredi au dimanche', '2024-01-08 09:17:00'),
('msg_004', 'conv_001', 'agent_001', 'Marie Dubois', 'agent', 'Parfait ! Nous avons une Toyota Camry disponible à 35 000 FCFA/jour. Souhaitez-vous la réserver ?', '2024-01-08 09:20:00'),
('msg_005', 'conv_001', 'client_001', 'Alain Fouda', 'client', 'Oui, c''est parfait. Comment procéder pour la réservation ?', '2024-01-08 09:22:00'),

-- Conversation 2
('msg_006', 'conv_002', 'client_002', 'Sylvie Manga', 'client', 'Salut, quels sont vos tarifs pour une location longue durée ?', '2024-01-08 10:30:00'),
('msg_007', 'conv_002', 'agent_002', 'Jean Kamga', 'agent', 'Bonjour Mme Manga ! Pour les locations longue durée (+ de 7 jours), nous avons des tarifs préférentiels. Quelle durée envisagez-vous ?', '2024-01-08 10:32:00'),
('msg_008', 'conv_002', 'client_002', 'Sylvie Manga', 'client', 'Environ 1 mois, pour un véhicule économique', '2024-01-08 10:35:00'),
('msg_009', 'conv_002', 'agent_002', 'Jean Kamga', 'agent', 'Excellent ! Pour 1 mois, nous proposons une Hyundai Accent à 25 000 FCFA/jour au lieu de 30 000. Cela vous intéresse ?', '2024-01-08 10:38:00'),

-- Conversation 3
('msg_010', 'conv_003', 'client_003', 'Ibrahim Mahamat', 'client', 'Bonsoir, j''ai un problème avec ma réservation', '2024-01-08 11:00:00'),
('msg_011', 'conv_003', 'agent_003', 'Fatima Nkomo', 'agent', 'Bonsoir M. Mahamat. Je suis désolée d''apprendre cela. Pouvez-vous me donner votre numéro de réservation ?', '2024-01-08 11:05:00'),
('msg_012', 'conv_003', 'client_003', 'Ibrahim Mahamat', 'client', 'C''est la réservation RES-2024-001', '2024-01-08 11:07:00'),
('msg_013', 'conv_003', 'agent_003', 'Fatima Nkomo', 'agent', 'Je vois votre réservation. Quel est le problème exactement ?', '2024-01-08 11:10:00'),

-- Conversation 4 (active)
('msg_014', 'conv_004', 'client_004', 'Grace Biya', 'client', 'Bonjour, je cherche un 4x4 pour aller à Kribi ce weekend', '2024-01-08 14:00:00'),
('msg_015', 'conv_004', 'agent_001', 'Marie Dubois', 'agent', 'Bonjour Mme Biya ! Excellente destination ! Nous avons plusieurs 4x4 disponibles. Combien de personnes serez-vous ?', '2024-01-08 14:02:00'),

-- Conversation 5 (en attente)
('msg_016', 'conv_005', 'client_005', 'Roger Milla', 'client', 'Bonjour, j''aimerais connaître vos conditions de location', '2024-01-08 14:30:00');

-- Insérer des métriques de test
INSERT INTO chat_metrics (conversation_id, response_time_seconds, resolution_time_seconds, message_count, agent_message_count, client_message_count) VALUES
('conv_001', 60, 1800, 5, 2, 3),
('conv_002', 120, 1200, 4, 2, 2),
('conv_003', 300, 1800, 4, 2, 2),
('conv_004', 120, NULL, 2, 1, 1),
('conv_005', NULL, NULL, 1, 0, 1);

-- Afficher un message de confirmation
SELECT 'Tables de chat créées et données de test insérées avec succès !' as message;
SELECT 'Nombre d''agents:' as info, COUNT(*) as count FROM chat_participants WHERE user_type = 'agent';
SELECT 'Nombre de conversations:' as info, COUNT(*) as count FROM chat_conversations;
SELECT 'Nombre de messages:' as info, COUNT(*) as count FROM chat_messages;
