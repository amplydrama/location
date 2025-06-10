-- Script de vérification et réparation du système de chat

-- Vérifier l'existence des tables
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    -- Compter les tables de chat existantes
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_name IN ('chat_participants', 'chat_conversations', 'chat_messages', 'chat_sessions', 'chat_metrics')
    AND table_schema = 'public';
    
    RAISE NOTICE 'Nombre de tables de chat trouvées: %', table_count;
    
    -- Vérifier chaque table individuellement
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_participants') THEN
        RAISE NOTICE '✓ Table chat_participants existe';
    ELSE
        RAISE NOTICE '✗ Table chat_participants manquante';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_conversations') THEN
        RAISE NOTICE '✓ Table chat_conversations existe';
    ELSE
        RAISE NOTICE '✗ Table chat_conversations manquante';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_messages') THEN
        RAISE NOTICE '✓ Table chat_messages existe';
    ELSE
        RAISE NOTICE '✗ Table chat_messages manquante';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_sessions') THEN
        RAISE NOTICE '✓ Table chat_sessions existe';
    ELSE
        RAISE NOTICE '✗ Table chat_sessions manquante';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_metrics') THEN
        RAISE NOTICE '✓ Table chat_metrics existe';
    ELSE
        RAISE NOTICE '✗ Table chat_metrics manquante';
    END IF;
    
    -- Afficher le nombre d'enregistrements dans chaque table
    IF table_count > 0 THEN
        RAISE NOTICE '--- Statistiques des tables ---';
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_participants') THEN
            SELECT COUNT(*) INTO table_count FROM chat_participants;
            RAISE NOTICE 'chat_participants: % enregistrements', table_count;
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_conversations') THEN
            SELECT COUNT(*) INTO table_count FROM chat_conversations;
            RAISE NOTICE 'chat_conversations: % enregistrements', table_count;
        END IF;
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_messages') THEN
            SELECT COUNT(*) INTO table_count FROM chat_messages;
            RAISE NOTICE 'chat_messages: % enregistrements', table_count;
        END IF;
    END IF;
    
    RAISE NOTICE '--- Vérification terminée ---';
END $$;
