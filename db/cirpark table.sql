CREATE TABLE capteur (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(20),
    description VARCHAR(100),
    numero INT,
    type VARCHAR(20)
);
CREATE TABLE etat(
    id INT PRIMARY KEY AUTO_INCREMENT,
    etat VARCHAR(20),
    date_heure DATETIME,
    id_capteur INT,
    FOREIGN KEY (id_capteur) REFERENCES capteur(id)
);
CREATE TABLE configuration(
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_capteur INT,
    mode VARCHAR(20),
    hauteur INT,
    eclaireage VARCHAR(20),
    detection VARCHAR(20),
    version VARCHAR(20),
    FOREIGN KEY (id_capteur) REFERENCES capteur(id)
);
SELECT capteur.nom, capteur.type, capteur.numero, etat.etat, configuration.hauteur, configuration.eclairage from capteur,etat,configuration where capteur.id = etat.id_capteur and capteur.id = configuration.id_capteur GROUP BY capteur.numero