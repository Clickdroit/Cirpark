<div align="center">
  <h1>✨ Une marocaine au portugal ✨</h1>
  <p><b>Progression (70%) :</b></p>
  <p>🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩 ⬜ ⬜ ⬜ ⬜</p>
</div>

---

## Amélioration du projet :

### 🔴 Priorité haute
- [x] Inserer dans le sql l'heure, la date et dans l'ordre
- [x] Corriger le sql
- [x] Réaliser le plan UML
- [x] Compléter le rest.php 
- [x] Réparer le cirpark_client_udp.php 
- [x] Ajouter des fonctions PUT/DELETE/POST dans le php *(En priorité)*
- [x] Lorsque l'on clique sur un capteur, il faut afficher les infos du capteur et pouvoir modifier les infos du capteur *(Dès que PUT/DELETE/POST est fait)*

### 🟠 Priorité moyenne
- [ ] Améliorée l'esthétique de l'interface *(Google Fonts, animations, icônes)*
- [~] Créer une meilleure étendu des capteurs + statistiques (Maxime)
- [x] Ajouter des graphiques *(Chart.js : taux d'occupation, camembert libre/occupé, heures de pointe)* (Maxime)
- [x] Auto-refresh du dashboard *(rafraîchissement automatique des données toutes les X secondes)*
- [x] Faire fonctionner les liens de navigation *(Historique, Documentation, Équipe pointent vers # actuellement)*
- [ ] Améliorer la dynamique du C++ 
- [-] Création du Formulaire de sécuriter

### 🟡 Priorité basse
- [x] Faire une documentation *(architecture, routes API, protocole UDP, schéma BDD)*
- [x] Faire la page équipe *(photos/avatars, rôles, répartition des tâches)*
- [x] Améliorer le responsive mobile *(adaptation pour tablettes et téléphones)*
- [ ] Ajouter de la validation des données dans POST/PUT *(vérifier que les champs existent avant utilisation)* ??

### ⚠️ Important
- [ ] **SUIVRE LES ATTENDUES !!!**

---

## Taches réalisées :

| Tâche | Date |
|-------|------|
| SQL corrigé (heure, date, ordre) | ✅ |
| Plan UML réalisé | ✅ |
| REST.php complété (GET) | ✅ |
| Ajout POST/PUT/DELETE | ✅ |

## Vérification locale de l'API PHP

Depuis la racine du projet, avec PHP disponible dans le terminal :

```powershell
php -l rest.php
php -l cirpark_client_udp.php
php -S 127.0.0.1:8080
```

Ouvrir ensuite `http://127.0.0.1:8080/index.html`. Le serveur intégré sert
uniquement au développement. Les requêtes SQL nécessitent aussi la base
configurée dans le projet ; les échanges UDP nécessitent le serveur Cirpark.
Les fichiers SQL sont dans `db/`. Ne pas les importer dans une base existante
sans avoir vérifié leur contenu et sauvegardé cette base.
