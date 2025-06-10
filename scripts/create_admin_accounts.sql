-- Script pour créer la table des comptes administrateurs

-- Table des comptes administrateurs
CREATE TABLE IF NOT EXISTS admin_accounts (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    permissions TEXT[],
    last_login TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion du super administrateur par défaut
INSERT INTO admin_accounts (
    first_name, 
    last_name, 
    email, 
    phone, 
    password_hash, 
    role, 
    permissions, 
    status
) VALUES (
    'Admin', 
    'Principal', 
    'admin@carloc-cameroun.com', 
    '+237 600 000 000', 
    '$2b$10$superSecureHashedPasswordForSuperAdmin', -- En production, utilisez un vrai hash de mot de passe
    'super_admin', 
    ARRAY['all'], 
    'active'
) ON CONFLICT (email) DO NOTHING;

-- Création d'un index sur l'email pour des recherches plus rapides
CREATE INDEX IF NOT EXISTS idx_admin_accounts_email ON admin_accounts(email);

-- Création d'un index sur le rôle pour filtrer par type d'administrateur
CREATE INDEX IF NOT EXISTS idx_admin_accounts_role ON admin_accounts(role);
