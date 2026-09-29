# 🅿️ Cirpark - Gestion de Parking Intelligent

Système complet de supervision, de télémétrie et de gestion pour parking connecté basé sur les équipements matériels **Cirpark**.

Conçu et développé dans le cadre du BTS CIEL-IR (Cybersécurité, Informatique et Réseaux, Électronique - option Informatique et Réseaux).

---

## 📋 Présentation du projet

Le projet **Cirpark** interconnecte des équipements physiques de détection (capteurs de présence de véhicules, afficheurs de places) avec un système d'information centralisé et une interface de supervision web en temps réel.

```
+---------------------------+          Trames UDP         +---------------------------+
|  Équipements Cirpark      |  <----------------------->  |  Client UDP Cirpark       |
|  (Capteurs, Afficheurs)   |                             |  (cirpark_client_udp.php) |
+---------------------------+                             +-------------+-------------+
                                                                        |
                                                                        v
+---------------------------+          Requêtes HTTP       +---------------------------+
|  Interface Web & Plan     |  <----------------------->  |  API REST & Base de Données|
|  (Dashboard, Chart.js)    |      (GET, POST, PUT,       |  (rest.php / MySQL)       |
+---------------------------+       DELETE / JSON)        +---------------------------+
```

---

## ✨ Fonctionnalités clés

- **🌐 API RESTful (`rest.php`) :**
  - Routes complètes (`GET`, `POST`, `PUT`, `DELETE`) pour gérer les capteurs, les configurations de places et les données d'historique.
  - Réponses normalisées au format JSON.
  - Sécurité des requêtes avec requêtes préparées PDO (protection contre les injections SQL).

- **📡 Communication Réseau UDP (`cirpark_client_udp.php`) :**
  - Client réseau communicant directement via sockets UDP avec les concentrateurs et capteurs Cirpark.
  - Encodage et décodage des trames constructeur Cirpark pour remonter l'état des places (libre / occupée).

- **📊 Tableau de Bord & Statistiques en temps réel :**
  - Horloge temps réel et rafraîchissement automatique de l'état du parking.
  - Visualisation des taux d'occupation via graphiques dynamiques (**Chart.js**).
  - Historique d'occupation et analyse des heures de pointe.

- **🗺️ Plan interactif des places (`plan/`) :**
  - Représentation visuelle du parking avec état dynamique de chaque place de stationnement.
  - Consultation et modification directe des caractéristiques d'un capteur en cliquant sur une place.

- **🔐 Authentification et Contrôle d'accès :**
  - Système de connexion sécurisé avec vérification des identifiants et garde de navigation (`auth-guard.js`).

---

## 🛠️ Stack Technique

- **Backend & Réseau :** PHP (Sockets UDP, PDO MySQL), API REST JSON.
- **Base de données :** MySQL (`cirpark.sql`).
- **Frontend :** HTML5, CSS3 (thèmes clair/sombre, responsive), JavaScript ES6 (Fetch/AJAX, Chart.js).
- **Équipements cibles :** Concentrateurs et capteurs ultrasoniques Cirpark.

---

## 🚀 Installation & Déploiement

### Prérequis
- Un serveur web local type **XAMPP**, **WAMP** ou **LAMP** (PHP 7.4+ et MySQL).

### 1. Base de données
1. Démarrez MySQL via votre gestionnaire (ex: phpMyAdmin).
2. Créez une base de données nommée `cirpark`.
3. Importez le fichier SQL [`db/cirpark.sql`](db/cirpark.sql).

### 2. Configuration
Les paramètres de connexion par défaut dans `rest.php` et `authentification/connexion.php` utilisent les valeurs locales standard :
```php
$maConnexion = new PDO("mysql:host=localhost;port=3306;dbname=cirpark", "root", "");
```

### 3. Lancement
Placez le dossier dans le répertoire `htdocs` ou `www` de votre serveur web, puis accédez à :
```
http://localhost/Cirpark/index.html
```
