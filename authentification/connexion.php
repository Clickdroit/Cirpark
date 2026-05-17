<?php
// 1. Paramètres de connexion à la base de données
$host = 'localhost';
$dbname = 'identifiant.sql'; 
$user = 'root';                // Utilisateur par défaut sous WAMP/XAMPP
$pass = '';                    // Mot de passe par défaut (vide sous WAMP)

try {
    // 2. Tentative de connexion avec PDO
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    // On active la gestion des erreurs pour le développement
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

// 3. Vérifier si les données ont bien été envoyées par le formulaire
if (isset($_POST['login']) && isset($_POST['password'])) {
    
    $loginSaisi = $_POST['login'];
    $mdpSaisi = $_POST['password'];

    // 4. Préparation de la requête SQL (Sécurité : évite les injections SQL)
    $requete = $db->prepare("SELECT * FROM utilisateurs WHERE login = :login AND mot_de_passe = :mdp");
    $requete->execute([
        'login' => $loginSaisi,
        'mdp' => $mdpSaisi
    ]);

    // 5. On récupère le résultat
    $utilisateur = $requete->fetch();

    if ($utilisateur) {
        // Si on a trouvé une ligne, l'utilisateur existe
        echo "<h1>Connexion réussie !</h1>";
        echo "Bienvenue " . htmlspecialchars($utilisateur['login']);
    } else {
        // Sinon, les identifiants sont faux
        echo "<h1>Erreur</h1>";
        echo " nom d'utilisateur ou mot de passe incorrect.";
    }
}
?>