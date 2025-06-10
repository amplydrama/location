-- Script d'insertion des données de test pour le système de chat

-- Insertion des agents de test
INSERT INTO chat_participants (user_id, user_name, user_type, email, phone, is_online) VALUES
('agent_001', 'Marie Tagne', 'agent', 'marie.tagne@carloc-cameroun.com', '+237 677 111 222', true),
('agent_002', 'Paul Kouam', 'agent', 'paul.kouam@carloc-cameroun.com', '+237 699 333 444', false),
('agent_003', 'Fatima Bello', 'agent', 'fatima.bello@carloc-cameroun.com', '+237 655 555 666', true)
ON CONFLICT (user_id) DO NOTHING;

-- Insertion des clients de test
INSERT INTO chat_participants (user_id, user_name, user_type, email, phone, is_online) VALUES
('client_001', 'Jean Dupont', 'client', 'jean.dupont@email.com', '+237 677 123 456', false),
('client_002', 'Marie Ngono', 'client', 'marie.ngono@email.com', '+237 699 987 654', false),
('client_003', 'Paul Mbarga', 'client', 'paul.mbarga@email.com', '+237 655 111 222', false)
ON CONFLICT (user_id) DO NOTHING;

-- Insertion des conversations de test
INSERT INTO chat_conversations (conversation_id, client_id, agent_id, client_name, agent_name, status, category, started_at, ended_at, rating, feedback) VALUES
('chat_001', 'client_001', 'agent_001', 'Jean Dupont', 'Marie Tagne', 'ended', 'reservation', '2024-01-15 10:30:00', '2024-01-15 10:45:00', 5, 'Excellent service, très réactif'),
('chat_002', 'client_002', 'agent_001', 'Marie Ngono', 'Marie Tagne', 'ended', 'information', '2024-01-16 14:20:00', '2024-01-16 14:35:00', 4, 'Bon support, informations claires'),
('chat_003', 'client_003', 'agent_002', 'Paul Mbarga', 'Paul Kouam', 'ended', 'probleme', '2024-01-17 09:15:00', '2024-01-17 09:30:00', 5, 'Problème résolu rapidement')
ON CONFLICT (conversation_id) DO NOTHING;

-- Insertion des messages de test
INSERT INTO chat_messages (message_id, conversation_id, sender_id, sender_name, sender_type, content, created_at) VALUES
-- Conversation 1
('msg_001', 'chat_001', 'client_001', 'Jean Dupont', 'client', 'Bonjour, je souhaite réserver une voiture pour ce weekend', '2024-01-15 10:30:00'),
('msg_002', 'chat_001', 'agent_001', 'Marie Tagne', 'agent', 'Bonjour Jean ! Je serais ravie de vous aider. Pour quelles dates souhaitez-vous réserver ?', '2024-01-15 10:31:00'),
('msg_003', 'chat_001', 'client_001', 'Jean Dupont', 'client', 'Du samedi 20 janvier au dimanche 21 janvier', '2024-01-15 10:32:00'),
('msg_004', 'chat_001', 'agent_001', 'Marie Tagne', 'agent', 'Parfait ! Quel type de véhicule recherchez-vous ? Nous avons des berlines, SUV, et véhicules économiques disponibles.', '2024-01-15 10:33:00'),
('msg_005', 'chat_001', 'client_001', 'Jean Dupont', 'client', 'Une berline confortable pour 4 personnes', '2024-01-15 10:34:00'),
('msg_006', 'chat_001', 'agent_001', 'Marie Tagne', 'agent', 'Je vous recommande notre Toyota Corolla à 25 000 FCFA/jour. Voulez-vous que je vous envoie le lien de réservation ?', '2024-01-15 10:35:00'),
('msg_007', 'chat_001', 'client_001', 'Jean Dupont', 'client', 'Oui, parfait !', '2024-01-15 10:36:00'),

-- Conversation 2
('msg_008', 'chat_002', 'client_002', 'Marie Ngono', 'client', 'Bonjour, quels sont vos tarifs pour une location longue durée ?', '2024-01-16 14:20:00'),
('msg_009', 'chat_002', 'agent_001', 'Marie Tagne', 'agent', 'Bonjour Marie ! Pour les locations longue durée (plus de 7 jours), nous proposons des tarifs dégressifs. Combien de temps souhaitez-vous louer ?', '2024-01-16 14:21:00'),
('msg_010', 'chat_002', 'client_002', 'Marie Ngono', 'client', 'Environ 1 mois', '2024-01-16 14:22:00'),
('msg_011', 'chat_002', 'agent_001', 'Marie Tagne', 'agent', 'Excellent ! Pour 1 mois, nous offrons une réduction de 20% sur nos tarifs journaliers. Je peux vous envoyer notre grille tarifaire détaillée.', '2024-01-16 14:23:00'),

-- Conversation 3
('msg_012', 'chat_003', 'client_003', 'Paul Mbarga', 'client', 'Bonjour, j''ai un problème avec ma réservation', '2024-01-17 09:15:00'),
('msg_013', 'chat_003', 'agent_002', 'Paul Kouam', 'agent', 'Bonjour Paul ! Je suis désolé d''apprendre que vous rencontrez un problème. Pouvez-vous me donner votre numéro de réservation ?', '2024-01-17 09:16:00'),
('msg_014', 'chat_003', 'client_003', 'Paul Mbarga', 'client', 'C''est la réservation #12345', '2024-01-17 09:17:00'),
('msg_015', 'chat_003', 'agent_002', 'Paul Kouam', 'agent', 'Je vois votre réservation. Quel est le problème exactement ?', '2024-01-17 09:18:00'),
('msg_016', 'chat_003', 'client_003', 'Paul Mbarga', 'client', 'Le paiement n''est pas passé avec MTN MoMo', '2024-01-17 09:19:00'),
('msg_017', 'chat_003', 'agent_002', 'Paul Kouam', 'agent', 'Je vais vérifier cela immédiatement. Pouvez-vous me confirmer le numéro de téléphone utilisé pour le paiement ?', '2024-01-17 09:20:00')
ON CONFLICT (message_id) DO NOTHING;

-- Insertion des métriques de test
INSERT INTO chat_metrics (conversation_id, response_time_seconds, resolution_time_seconds, message_count, agent_message_count, client_message_count) VALUES
('chat_001', 60, 900, 7, 3, 4),
('chat_002', 45, 900, 4, 2, 2),
('chat_003', 30, 900, 6, 3, 3)
ON CONFLICT DO NOTHING;
