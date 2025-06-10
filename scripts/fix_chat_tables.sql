-- Supprimer les tables existantes si elles existent
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_conversations CASCADE;
DROP TABLE IF EXISTS chat_participants CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS chat_metrics CASCADE;

-- Créer la table des participants (clients et agents)
CREATE TABLE chat_participants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    type VARCHAR(20) NOT NULL CHECK (type IN ('client', 'agent')),
    status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy')),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table des conversations
CREATE TABLE chat_conversations (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES chat_participants(id),
    agent_id INTEGER REFERENCES chat_participants(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'waiting', 'closed', 'archived')),
    category VARCHAR(50) DEFAULT 'general',
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table des messages
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES chat_participants(id),
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer la table des sessions de chat
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    participant_id INTEGER REFERENCES chat_participants(id),
    session_token VARCHAR(255) UNIQUE,
    ip_address INET,
    user_agent TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Créer la table des métriques
CREATE TABLE chat_metrics (
    id SERIAL PRIMARY KEY,
    date DATE DEFAULT CURRENT_DATE,
    total_conversations INTEGER DEFAULT 0,
    active_conversations INTEGER DEFAULT 0,
    completed_conversations INTEGER DEFAULT 0,
    average_response_time INTERVAL,
    average_resolution_time INTERVAL,
    customer_satisfaction DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer les index pour améliorer les performances
CREATE INDEX idx_chat_conversations_client_id ON chat_conversations(client_id);
CREATE INDEX idx_chat_conversations_agent_id ON chat_conversations(agent_id);
CREATE INDEX idx_chat_conversations_status ON chat_conversations(status);
CREATE INDEX idx_chat_conversations_created_at ON chat_conversations(created_at);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_chat_participants_type ON chat_participants(type);
CREATE INDEX idx_chat_participants_status ON chat_participants(status);
CREATE INDEX idx_chat_sessions_participant_id ON chat_sessions(participant_id);
CREATE INDEX idx_chat_sessions_is_active ON chat_sessions(is_active);
CREATE INDEX idx_chat_metrics_date ON chat_metrics(date);

-- Insérer des données de test
INSERT INTO chat_participants (name, email, phone, type, status) VALUES
('Agent Support', 'support@carloc-cameroun.com', '+237677123456', 'agent', 'online'),
('Agent Commercial', 'commercial@carloc-cameroun.com', '+237699987654', 'agent', 'online'),
('Jean Dupont', 'jean.dupont@email.com', '+237677111222', 'client', 'offline'),
('Marie Ngono', 'marie.ngono@email.com', '+237699333444', 'client', 'offline'),
('Paul Mbarga', 'paul.mbarga@email.com', '+237655555666', 'client', 'offline');

-- Insérer des conversations de test
INSERT INTO chat_conversations (client_id, agent_id, status, category, priority, rating, feedback, started_at, ended_at) VALUES
(3, 1, 'closed', 'reservation', 'normal', 5, 'Excellent service, très réactif', '2024-01-15 10:00:00', '2024-01-15 10:30:00'),
(4, 2, 'closed', 'information', 'normal', 4, 'Bon service', '2024-01-16 14:00:00', '2024-01-16 14:20:00'),
(5, 1, 'active', 'support', 'high', NULL, NULL, '2024-01-17 09:00:00', NULL);

-- Insérer des messages de test
INSERT INTO chat_messages (conversation_id, sender_id, content, message_type, is_read, created_at) VALUES
(1, 3, 'Bonjour, je souhaite réserver une voiture pour ce weekend', 'text', TRUE, '2024-01-15 10:00:00'),
(1, 1, 'Bonjour ! Je serais ravi de vous aider. Pour quelles dates exactement ?', 'text', TRUE, '2024-01-15 10:01:00'),
(1, 3, 'Du vendredi 19 au dimanche 21 janvier', 'text', TRUE, '2024-01-15 10:02:00'),
(1, 1, 'Parfait ! Quel type de véhicule préférez-vous ?', 'text', TRUE, '2024-01-15 10:03:00'),
(2, 4, 'Quels sont vos tarifs pour une berline ?', 'text', TRUE, '2024-01-16 14:00:00'),
(2, 2, 'Nos berlines sont à partir de 40,000 FCFA/jour. Souhaitez-vous plus de détails ?', 'text', TRUE, '2024-01-16 14:01:00'),
(3, 5, 'J''ai un problème avec ma réservation', 'text', TRUE, '2024-01-17 09:00:00'),
(3, 1, 'Je vais vous aider immédiatement. Pouvez-vous me donner votre numéro de réservation ?', 'text', TRUE, '2024-01-17 09:01:00');

-- Insérer des métriques de test
INSERT INTO chat_metrics (date, total_conversations, active_conversations, completed_conversations, average_response_time, customer_satisfaction) VALUES
('2024-01-15', 5, 1, 4, '00:02:30', 4.5),
('2024-01-16', 3, 0, 3, '00:01:45', 4.2),
('2024-01-17', 2, 1, 1, '00:03:00', 4.8);
