-- Script d'insertion de données riches pour les analytics du chat
-- Suppression des données existantes pour un nouveau départ
DELETE FROM chat_metrics;
DELETE FROM chat_messages;
DELETE FROM chat_conversations;
DELETE FROM chat_participants WHERE user_type IN ('agent', 'client');

-- Insertion d'agents avec différents profils
INSERT INTO chat_participants (user_id, user_name, user_type, email, phone, is_online, created_at) VALUES
-- Agents seniors (très performants)
('agent_001', 'Marie Tagne', 'agent', 'marie.tagne@carloc-cameroun.com', '+237 677 111 222', true, '2024-01-01 08:00:00'),
('agent_002', 'Paul Kouam', 'agent', 'paul.kouam@carloc-cameroun.com', '+237 699 333 444', true, '2024-01-01 08:00:00'),

-- Agents intermédiaires
('agent_003', 'Fatima Bello', 'agent', 'fatima.bello@carloc-cameroun.com', '+237 655 555 666', false, '2024-01-05 09:00:00'),
('agent_004', 'Jean Mballa', 'agent', 'jean.mballa@carloc-cameroun.com', '+237 677 777 888', true, '2024-01-05 09:00:00'),
('agent_005', 'Aminata Diallo', 'agent', 'aminata.diallo@carloc-cameroun.com', '+237 699 999 000', true, '2024-01-10 10:00:00'),

-- Agents juniors (en formation)
('agent_006', 'Pierre Nkomo', 'agent', 'pierre.nkomo@carloc-cameroun.com', '+237 655 111 333', false, '2024-01-15 11:00:00'),
('agent_007', 'Grace Fouda', 'agent', 'grace.fouda@carloc-cameroun.com', '+237 677 444 555', true, '2024-01-15 11:00:00')
ON CONFLICT (user_id) DO NOTHING;

-- Insertion de clients variés
INSERT INTO chat_participants (user_id, user_name, user_type, email, phone, is_online, created_at) VALUES
-- Clients réguliers
('client_001', 'Jean Dupont', 'client', 'jean.dupont@email.com', '+237 677 123 456', false, '2024-01-10 10:00:00'),
('client_002', 'Marie Ngono', 'client', 'marie.ngono@email.com', '+237 699 987 654', false, '2024-01-10 11:00:00'),
('client_003', 'Paul Mbarga', 'client', 'paul.mbarga@email.com', '+237 655 111 222', false, '2024-01-11 09:00:00'),
('client_004', 'Sarah Kamga', 'client', 'sarah.kamga@email.com', '+237 677 333 444', false, '2024-01-11 14:00:00'),
('client_005', 'David Tchoumi', 'client', 'david.tchoumi@email.com', '+237 699 555 666', false, '2024-01-12 08:00:00'),

-- Nouveaux clients
('client_006', 'Aisha Mohamadou', 'client', 'aisha.mohamadou@email.com', '+237 655 777 888', false, '2024-01-12 16:00:00'),
('client_007', 'Robert Essomba', 'client', 'robert.essomba@email.com', '+237 677 999 000', false, '2024-01-13 10:00:00'),
('client_008', 'Lydia Manga', 'client', 'lydia.manga@email.com', '+237 699 111 333', false, '2024-01-13 15:00:00'),
('client_009', 'Emmanuel Biya', 'client', 'emmanuel.biya@email.com', '+237 655 444 555', false, '2024-01-14 09:00:00'),
('client_010', 'Christelle Onana', 'client', 'christelle.onana@email.com', '+237 677 666 777', false, '2024-01-14 13:00:00'),

-- Clients VIP
('client_011', 'Dr. Michel Atangana', 'client', 'michel.atangana@email.com', '+237 699 888 999', false, '2024-01-15 11:00:00'),
('client_012', 'Mme Josephine Eyenga', 'client', 'josephine.eyenga@email.com', '+237 655 222 444', false, '2024-01-15 14:00:00'),

-- Clients entreprise
('client_013', 'SABC Cameroun', 'client', 'contact@sabc-cameroun.com', '+237 677 555 888', false, '2024-01-16 08:00:00'),
('client_014', 'Orange Cameroun', 'client', 'fleet@orange.cm', '+237 699 777 111', false, '2024-01-16 10:00:00'),
('client_015', 'Total Energies', 'client', 'logistics@totalenergies.cm', '+237 655 333 666', false, '2024-01-16 15:00:00')
ON CONFLICT (user_id) DO NOTHING;

-- Insertion de conversations variées avec différents statuts et catégories
INSERT INTO chat_conversations (conversation_id, client_id, agent_id, client_name, agent_name, status, priority, category, started_at, ended_at, last_message_at, rating, feedback, created_at, updated_at) VALUES

-- Conversations terminées avec excellentes évaluations (Semaine 1)
('chat_001', 'client_001', 'agent_001', 'Jean Dupont', 'Marie Tagne', 'ended', 'normal', 'reservation', '2024-01-15 10:30:00', '2024-01-15 10:45:00', '2024-01-15 10:45:00', 5, 'Excellent service, très réactif et professionnel', '2024-01-15 10:30:00', '2024-01-15 10:45:00'),
('chat_002', 'client_002', 'agent_001', 'Marie Ngono', 'Marie Tagne', 'ended', 'normal', 'information', '2024-01-15 14:20:00', '2024-01-15 14:35:00', '2024-01-15 14:35:00', 5, 'Très satisfaite, informations claires et complètes', '2024-01-15 14:20:00', '2024-01-15 14:35:00'),
('chat_003', 'client_003', 'agent_002', 'Paul Mbarga', 'Paul Kouam', 'ended', 'high', 'probleme', '2024-01-15 09:15:00', '2024-01-15 09:30:00', '2024-01-15 09:30:00', 5, 'Problème résolu rapidement, excellent support', '2024-01-15 09:15:00', '2024-01-15 09:30:00'),

-- Conversations de la semaine 2 avec mix d'évaluations
('chat_004', 'client_004', 'agent_003', 'Sarah Kamga', 'Fatima Bello', 'ended', 'normal', 'reservation', '2024-01-16 11:00:00', '2024-01-16 11:20:00', '2024-01-16 11:20:00', 4, 'Bon service, quelques lenteurs au début', '2024-01-16 11:00:00', '2024-01-16 11:20:00'),
('chat_005', 'client_005', 'agent_004', 'David Tchoumi', 'Jean Mballa', 'ended', 'normal', 'information', '2024-01-16 15:30:00', '2024-01-16 15:50:00', '2024-01-16 15:50:00', 4, 'Informations utiles, agent sympathique', '2024-01-16 15:30:00', '2024-01-16 15:50:00'),
('chat_006', 'client_006', 'agent_005', 'Aisha Mohamadou', 'Aminata Diallo', 'ended', 'normal', 'reservation', '2024-01-17 08:45:00', '2024-01-17 09:10:00', '2024-01-17 09:10:00', 5, 'Parfait ! Réservation effectuée sans problème', '2024-01-17 08:45:00', '2024-01-17 09:10:00'),

-- Conversations avec problèmes techniques
('chat_007', 'client_007', 'agent_006', 'Robert Essomba', 'Pierre Nkomo', 'ended', 'high', 'probleme', '2024-01-17 13:00:00', '2024-01-17 13:45:00', '2024-01-17 13:45:00', 3, 'Problème résolu mais cela a pris du temps', '2024-01-17 13:00:00', '2024-01-17 13:45:00'),
('chat_008', 'client_008', 'agent_007', 'Lydia Manga', 'Grace Fouda', 'ended', 'high', 'probleme', '2024-01-18 10:15:00', '2024-01-18 11:00:00', '2024-01-18 11:00:00', 2, 'Service décevant, plusieurs transferts nécessaires', '2024-01-18 10:15:00', '2024-01-18 11:00:00'),

-- Conversations en cours
('chat_009', 'client_009', 'agent_001', 'Emmanuel Biya', 'Marie Tagne', 'active', 'normal', 'information', '2024-01-18 14:30:00', NULL, '2024-01-18 14:35:00', NULL, NULL, '2024-01-18 14:30:00', '2024-01-18 14:35:00'),
('chat_010', 'client_010', 'agent_002', 'Christelle Onana', 'Paul Kouam', 'active', 'normal', 'reservation', '2024-01-18 15:00:00', NULL, '2024-01-18 15:05:00', NULL, NULL, '2024-01-18 15:00:00', '2024-01-18 15:05:00'),

-- Conversations en attente
('chat_011', 'client_011', NULL, 'Dr. Michel Atangana', NULL, 'waiting', 'high', 'information', '2024-01-18 16:00:00', NULL, '2024-01-18 16:00:00', NULL, NULL, '2024-01-18 16:00:00', '2024-01-18 16:00:00'),
('chat_012', 'client_012', NULL, 'Mme Josephine Eyenga', NULL, 'waiting', 'normal', 'reservation', '2024-01-18 16:15:00', NULL, '2024-01-18 16:15:00', NULL, NULL, '2024-01-18 16:15:00', '2024-01-18 16:15:00'),

-- Conversations entreprise (priorité élevée)
('chat_013', 'client_013', 'agent_001', 'SABC Cameroun', 'Marie Tagne', 'ended', 'high', 'reservation', '2024-01-18 09:00:00', '2024-01-18 09:25:00', '2024-01-18 09:25:00', 5, 'Service professionnel, parfait pour nos besoins', '2024-01-18 09:00:00', '2024-01-18 09:25:00'),
('chat_014', 'client_014', 'agent_002', 'Orange Cameroun', 'Paul Kouam', 'ended', 'high', 'information', '2024-01-18 11:30:00', '2024-01-18 11:50:00', '2024-01-18 11:50:00', 4, 'Bon support, tarifs compétitifs', '2024-01-18 11:30:00', '2024-01-18 11:50:00'),
('chat_015', 'client_015', 'agent_003', 'Total Energies', 'Fatima Bello', 'active', 'high', 'reservation', '2024-01-18 14:00:00', NULL, '2024-01-18 14:10:00', NULL, NULL, '2024-01-18 14:00:00', '2024-01-18 14:10:00'),

-- Conversations abandonnées
('chat_016', 'client_004', NULL, 'Sarah Kamga', NULL, 'abandoned', 'normal', 'information', '2024-01-17 16:30:00', NULL, '2024-01-17 16:30:00', NULL, NULL, '2024-01-17 16:30:00', '2024-01-17 16:30:00'),
('chat_017', 'client_006', NULL, 'Aisha Mohamadou', NULL, 'abandoned', 'normal', 'reservation', '2024-01-18 12:00:00', NULL, '2024-01-18 12:00:00', NULL, NULL, '2024-01-18 12:00:00', '2024-01-18 12:00:00')

ON CONFLICT (conversation_id) DO NOTHING;

-- Insertion de messages détaillés pour chaque conversation
INSERT INTO chat_messages (message_id, conversation_id, sender_id, sender_name, sender_type, content, message_type, created_at) VALUES

-- Messages pour chat_001 (Réservation réussie)
('msg_001', 'chat_001', 'client_001', 'Jean Dupont', 'client', 'Bonjour, je souhaite réserver une voiture pour ce weekend', 'text', '2024-01-15 10:30:00'),
('msg_002', 'chat_001', 'agent_001', 'Marie Tagne', 'agent', 'Bonjour Jean ! Je serais ravie de vous aider. Pour quelles dates souhaitez-vous réserver ?', 'text', '2024-01-15 10:31:00'),
('msg_003', 'chat_001', 'client_001', 'Jean Dupont', 'client', 'Du samedi 20 janvier au dimanche 21 janvier', 'text', '2024-01-15 10:32:00'),
('msg_004', 'chat_001', 'agent_001', 'Marie Tagne', 'agent', 'Parfait ! Quel type de véhicule recherchez-vous ? Nous avons des berlines, SUV, et véhicules économiques disponibles.', 'text', '2024-01-15 10:33:00'),
('msg_005', 'chat_001', 'client_001', 'Jean Dupont', 'client', 'Une berline confortable pour 4 personnes', 'text', '2024-01-15 10:34:00'),
('msg_006', 'chat_001', 'agent_001', 'Marie Tagne', 'agent', 'Je vous recommande notre Toyota Corolla à 25 000 FCFA/jour. Voulez-vous que je vous envoie le lien de réservation ?', 'text', '2024-01-15 10:35:00'),
('msg_007', 'chat_001', 'client_001', 'Jean Dupont', 'client', 'Oui, parfait ! Comment puis-je payer ?', 'text', '2024-01-15 10:36:00'),
('msg_008', 'chat_001', 'agent_001', 'Marie Tagne', 'agent', 'Vous pouvez payer par MTN MoMo, Orange Money ou en espèces. Je vous envoie le lien maintenant.', 'text', '2024-01-15 10:37:00'),

-- Messages pour chat_007 (Problème technique)
('msg_020', 'chat_007', 'client_007', 'Robert Essomba', 'client', 'Bonjour, j''ai un problème avec ma réservation en ligne', 'text', '2024-01-17 13:00:00'),
('msg_021', 'chat_007', 'agent_006', 'Pierre Nkomo', 'agent', 'Bonjour ! Je vais vous aider. Quel est le problème exactement ?', 'text', '2024-01-17 13:05:00'),
('msg_022', 'chat_007', 'client_007', 'Robert Essomba', 'client', 'Le paiement MTN MoMo ne passe pas, j''ai essayé plusieurs fois', 'text', '2024-01-17 13:06:00'),
('msg_023', 'chat_007', 'agent_006', 'Pierre Nkomo', 'agent', 'Je comprends votre frustration. Laissez-moi vérifier avec notre équipe technique...', 'text', '2024-01-17 13:10:00'),
('msg_024', 'chat_007', 'client_007', 'Robert Essomba', 'client', 'D''accord, j''attends', 'text', '2024-01-17 13:11:00'),
('msg_025', 'chat_007', 'agent_006', 'Pierre Nkomo', 'agent', 'Il y a effectivement un problème temporaire avec MTN MoMo. Pouvez-vous essayer Orange Money ?', 'text', '2024-01-17 13:25:00'),
('msg_026', 'chat_007', 'client_007', 'Robert Essomba', 'client', 'Je n''ai pas Orange Money. Y a-t-il une autre solution ?', 'text', '2024-01-17 13:26:00'),
('msg_027', 'chat_007', 'agent_006', 'Pierre Nkomo', 'agent', 'Vous pouvez payer en espèces lors de la récupération du véhicule. Je réserve la voiture pour vous.', 'text', '2024-01-17 13:30:00'),
('msg_028', 'chat_007', 'client_007', 'Robert Essomba', 'client', 'Parfait, merci pour votre aide', 'text', '2024-01-17 13:31:00'),

-- Messages pour chat_008 (Service décevant)
('msg_030', 'chat_008', 'client_008', 'Lydia Manga', 'client', 'Bonjour, j''ai besoin d''aide urgente', 'text', '2024-01-18 10:15:00'),
('msg_031', 'chat_008', 'agent_007', 'Grace Fouda', 'agent', 'Bonjour, que puis-je faire pour vous ?', 'text', '2024-01-18 10:20:00'),
('msg_032', 'chat_008', 'client_008', 'Lydia Manga', 'client', 'Ma voiture de location est tombée en panne', 'text', '2024-01-18 10:21:00'),
('msg_033', 'chat_008', 'agent_007', 'Grace Fouda', 'agent', 'Je vais vous transférer au service technique...', 'text', '2024-01-18 10:25:00'),
('msg_034', 'chat_008', 'client_008', 'Lydia Manga', 'client', 'Encore un transfert ? C''est le troisième !', 'text', '2024-01-18 10:26:00'),
('msg_035', 'chat_008', 'agent_007', 'Grace Fouda', 'agent', 'Je suis désolée, laissez-moi gérer cela directement. Où êtes-vous exactement ?', 'text', '2024-01-18 10:30:00'),
('msg_036', 'chat_008', 'client_008', 'Lydia Manga', 'client', 'À Douala, près du marché central', 'text', '2024-01-18 10:31:00'),
('msg_037', 'chat_008', 'agent_007', 'Grace Fouda', 'agent', 'J''envoie une équipe de dépannage. Ils seront là dans 30 minutes.', 'text', '2024-01-18 10:35:00'),

-- Messages pour conversations en cours
('msg_040', 'chat_009', 'client_009', 'Emmanuel Biya', 'client', 'Bonjour, quels sont vos tarifs pour une location d''une semaine ?', 'text', '2024-01-18 14:30:00'),
('msg_041', 'chat_009', 'agent_001', 'Marie Tagne', 'agent', 'Bonjour Emmanuel ! Pour une semaine, nous offrons des tarifs dégressifs. Quel type de véhicule vous intéresse ?', 'text', '2024-01-18 14:32:00'),
('msg_042', 'chat_009', 'client_009', 'Emmanuel Biya', 'client', 'Un SUV pour la famille', 'text', '2024-01-18 14:33:00'),
('msg_043', 'chat_009', 'agent_001', 'Marie Tagne', 'agent', 'Parfait ! Notre Toyota RAV4 est à 45 000 FCFA/jour, mais pour 7 jours, le tarif passe à 40 000 FCFA/jour.', 'text', '2024-01-18 14:35:00'),

-- Messages pour conversation entreprise
('msg_050', 'chat_013', 'client_013', 'SABC Cameroun', 'client', 'Bonjour, nous avons besoin de 5 véhicules pour notre équipe de tournage', 'text', '2024-01-18 09:00:00'),
('msg_051', 'chat_013', 'agent_001', 'Marie Tagne', 'agent', 'Bonjour ! Je m''occupe personnellement des comptes entreprise. Pour quelles dates ?', 'text', '2024-01-18 09:01:00'),
('msg_052', 'chat_013', 'client_013', 'SABC Cameroun', 'client', 'Du 25 janvier au 2 février, dans la région du Nord', 'text', '2024-01-18 09:02:00'),
('msg_053', 'chat_013', 'agent_001', 'Marie Tagne', 'agent', 'Nous avons une flotte adaptée. Je vous prépare un devis avec remise entreprise de 15%.', 'text', '2024-01-18 09:05:00'),
('msg_054', 'chat_013', 'client_013', 'SABC Cameroun', 'client', 'Excellent, nous avons aussi besoin d''un chauffeur expérimenté', 'text', '2024-01-18 09:06:00'),
('msg_055', 'chat_013', 'agent_001', 'Marie Tagne', 'agent', 'Bien sûr, nos chauffeurs connaissent parfaitement la région. Je vous envoie le devis complet.', 'text', '2024-01-18 09:10:00')

ON CONFLICT (message_id) DO NOTHING;

-- Insertion des métriques détaillées
INSERT INTO chat_metrics (conversation_id, response_time_seconds, resolution_time_seconds, message_count, agent_message_count, client_message_count, created_at) VALUES

-- Métriques pour conversations excellentes (agents seniors)
('chat_001', 60, 900, 8, 4, 4, '2024-01-15 10:45:00'),
('chat_002', 45, 900, 6, 3, 3, '2024-01-15 14:35:00'),
('chat_003', 30, 900, 6, 3, 3, '2024-01-15 09:30:00'),
('chat_013', 60, 1500, 6, 3, 3, '2024-01-18 09:25:00'),

-- Métriques pour conversations moyennes
('chat_004', 120, 1200, 5, 2, 3, '2024-01-16 11:20:00'),
('chat_005', 90, 1200, 5, 2, 3, '2024-01-16 15:50:00'),
('chat_006', 75, 1500, 7, 4, 3, '2024-01-17 09:10:00'),
('chat_014', 105, 1200, 4, 2, 2, '2024-01-18 11:50:00'),

-- Métriques pour conversations problématiques
('chat_007', 300, 2700, 9, 5, 4, '2024-01-17 13:45:00'),
('chat_008', 300, 2700, 8, 4, 4, '2024-01-18 11:00:00'),

-- Métriques pour conversations en cours (partielles)
('chat_009', 120, NULL, 4, 2, 2, '2024-01-18 14:35:00'),
('chat_010', 90, NULL, 2, 1, 1, '2024-01-18 15:05:00'),
('chat_015', 180, NULL, 3, 1, 2, '2024-01-18 14:10:00')

ON CONFLICT DO NOTHING;

-- Mise à jour des statuts en ligne des agents (simulation réaliste)
UPDATE chat_participants SET 
  is_online = CASE 
    WHEN user_id IN ('agent_001', 'agent_002', 'agent_004', 'agent_005', 'agent_007') THEN true
    ELSE false
  END,
  last_seen = CASE 
    WHEN user_id IN ('agent_001', 'agent_002', 'agent_004', 'agent_005', 'agent_007') THEN NOW()
    ELSE NOW() - INTERVAL '2 hours'
  END
WHERE user_type = 'agent';

-- Affichage des statistiques finales
SELECT 
  'Participants créés' as type,
  COUNT(*) as total,
  COUNT(CASE WHEN user_type = 'agent' THEN 1 END) as agents,
  COUNT(CASE WHEN user_type = 'client' THEN 1 END) as clients
FROM chat_participants;

SELECT 
  'Conversations créées' as type,
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'ended' THEN 1 END) as terminées,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as actives,
  COUNT(CASE WHEN status = 'waiting' THEN 1 END) as en_attente,
  COUNT(CASE WHEN status = 'abandoned' THEN 1 END) as abandonnées
FROM chat_conversations;

SELECT 
  'Messages créés' as type,
  COUNT(*) as total,
  COUNT(CASE WHEN sender_type = 'agent' THEN 1 END) as agent_messages,
  COUNT(CASE WHEN sender_type = 'client' THEN 1 END) as client_messages
FROM chat_messages;

SELECT 
  'Métriques créées' as type,
  COUNT(*) as total,
  ROUND(AVG(response_time_seconds)) as temps_réponse_moyen,
  ROUND(AVG(resolution_time_seconds)) as temps_résolution_moyen
FROM chat_metrics;
