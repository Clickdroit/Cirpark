CREATE TABLE utilisateurs (
id_user INT PRIMARY KEY AUTO_INCREMENT, -- Un numéro unique qui s'incrémente tout seul
login VARCHAR(50) NOT NULL UNIQUE,      -- Le nom d'utilisateur (unique pour éviter les doublons)
mot_de_passe VARCHAR(255) NOT NULL,     -- Le mot de passe (on prévoit large pour le hachage)
role VARCHAR(20) DEFAULT 'users'         -- Optionnel : pour différencier admin et un autre utilisateurs
);

-- Insertion d'utilisateurs par défaut
INSERT INTO utilisateurs (login, mot_de_passe, role) VALUES 
('admin', '1234', 'admin'),
('user1', 'azerty', 'users'),
('eleve', 'btsciel', 'users');