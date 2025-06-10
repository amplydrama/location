-- Script pour créer les tables du système de chat
-- Ce script sera exécuté automatiquement

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

-- Insérer des agents de test
INSERT INTO chat_participants (user_id, user_name, user_type, email, is_online) VALUES
('agent_001', 'Marie Dubois', 'agent', 'marie.dubois@carloc-cameroun.com', true),
('agent_002', 'Jean Kamga', 'agent', 'jean.kamga@carloc-cameroun.com', false),
('agent_003', 'Fatima Nkomo', 'agent', 'fatima.nkomo@carloc-cameroun.com', true);

-- Insérer une conversation de test
INSERT INTO chat_conversations (conversation_id, client_id, agent_id, client_name, agent_name, status, category) VALUES
('test_conv_001', 'client_test', 'agent_001', 'Client Test', 'Marie Dubois', 'ended', 'general');

-- Insérer des messages de test
INSERT INTO chat_messages (message_id, conversation_id, sender_id, sender_name, sender_type, content) VALUES
('msg_001', 'test_conv_001', 'client_test', 'Client Test', 'client', 'Bonjour, j''ai besoin d''aide pour une réservation'),
('msg_002', 'test_conv_001', 'agent_001', 'Marie Dubois', 'agent', 'Bonjour ! Je serais ravie de vous aider. Quel type de véhicule recherchez-vous ?'),
('msg_003', 'test_conv_001', 'client_test', 'Client Test', 'client', 'Je cherche une voiture pour 3 jours à Douala'),
('msg_004', 'test_conv_001', 'agent_001', 'Marie Dubois', 'agent', 'Parfait ! Nous avons plusieurs options disponibles. Quand souhaitez-vous commencer la location ?');

-- Insérer des métriques de test
INSERT INTO chat_metrics (conversation_id, response_time_seconds, resolution_time_seconds, message_count, agent_message_count, client_message_count) VALUES
('test_conv_001', 45, 300, 4, 2, 2);

-- Afficher un message de confirmation
SELECT 'Tables de chat créées avec succès !' as message;
SELECT 'Agents disponibles:' as info;
SELECT user_name, email, is_online FROM chat_participants WHERE user_type = 'agent';
