<?php
try {
    $maConnexion = new PDO("mysql:host=localhost;port=3306;dbname=cirpark", "root", "");
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["erreur" => "Connexion BDD impossible"]);
    die();
}
$req_methode = $_SERVER['REQUEST_METHOD'];
$req_data = [];

if (isset($_SERVER['PATH_INFO'])) {
    $req_path = $_SERVER['PATH_INFO'];
    $req_data = explode('/', $req_path);
}
//.................. Pour le GET...........
if ($req_methode == 'GET') {
    if (count($req_data) == 2 && $req_data[1] == 'capteur') {
        $requete = "SELECT capteur.id, capteur.nom, capteur.description, capteur.type, capteur.numero, etat.etat, etat.date_heure, configuration.hauteur, configuration.eclairage 
                    FROM capteur, etat, configuration 
                    WHERE capteur.id = etat.id_capteur 
                    AND capteur.id = configuration.id_capteur 
                    AND etat.id IN (SELECT MAX(id) FROM etat GROUP BY id_capteur)";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->execute();
        $resultat = $req_prep->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($resultat);
    }

    elseif (count($req_data) == 3 && $req_data[1] == 'capteur' && is_numeric($req_data[2])) {
        $id = (int)$req_data[2];
        $requete = "SELECT capteur.id, capteur.nom, capteur.description, capteur.type, capteur.numero, etat.etat, etat.date_heure, configuration.hauteur, configuration.eclairage 
                    FROM capteur
                    LEFT JOIN configuration ON capteur.id = configuration.id_capteur
                    LEFT JOIN etat ON capteur.id = etat.id_capteur
                        AND etat.id = (SELECT MAX(id) FROM etat WHERE id_capteur = capteur.id)
                    WHERE capteur.id = :id";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->bindValue(':id', $id, PDO::PARAM_INT);
        $req_prep->execute();
        $resultat = $req_prep->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($resultat);
    }

    elseif (count($req_data) == 3 && $req_data[1] == 'capteur' && $req_data[2] == 'etat') {
        $requete = "SELECT * FROM etat";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->execute();
        $resultat = $req_prep->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($resultat);
    }

    elseif (count($req_data) == 4 && $req_data[1] == 'capteur' && $req_data[2] == 'etat') {
        $id = (int)$req_data[3];
        $requete = "SELECT * FROM etat WHERE id_capteur = :id ORDER BY date_heure DESC";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->bindValue(':id', $id, PDO::PARAM_INT);
        $req_prep->execute();
        $resultat = $req_prep->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($resultat);
    }

    elseif (count($req_data) == 3 && $req_data[1] == 'capteur' && $req_data[2] == 'configuration') {
        $requete = "SELECT * FROM configuration";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->execute();
        $resultat = $req_prep->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($resultat);
    }
    elseif (count($req_data) == 4 && $req_data[1] == 'capteur' && $req_data[2] == 'configuration') {
        $id = (int)$req_data[3];
        $requete = "SELECT * FROM configuration WHERE id_capteur = :id";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->bindValue(':id', $id, PDO::PARAM_INT);
        $req_prep->execute();
        $resultat = $req_prep->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($resultat);
    }
}

//.................. Pour le POST...........

if ($req_methode == 'POST') {

    $donnees_json = file_get_contents('php://input');
    $donnees = json_decode($donnees_json, true);

    // POST /capteur
    if (count($req_data) == 2 && $req_data[1] == 'capteur') {
        if (!isset($donnees['nom'], $donnees['type'], $donnees['numero'], $donnees['description'])) {
            http_response_code(400);
            echo json_encode(["erreur" => "Champs requis : nom, type, numero, description"]);
            die();
        }
        $nom = $donnees['nom'];
        $type = $donnees['type'];
        $numero = $donnees['numero'];
        $description = $donnees['description'];

        $requete = "INSERT INTO capteur (nom, type, numero, description) VALUES (:nom, :type, :numero, :description)";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->bindValue(':nom', $nom);
        $req_prep->bindValue(':type', $type);
        $req_prep->bindValue(':numero', $numero);
        $req_prep->bindValue(':description', $description);
        $req_prep->execute();
        $req_prep->closeCursor();

        http_response_code(201);
        echo json_encode(["message" => "Capteur ajouté"]);
    }

    // POST /capteur/etat
    elseif (count($req_data) == 3 && $req_data[1] == 'capteur' && $req_data[2] == 'etat') {
        if (!isset($donnees['id_capteur'], $donnees['etat'])) {
            http_response_code(400);
            echo json_encode(["erreur" => "Champs requis : id_capteur, etat"]);
            die();
        }
        $id_capteur = $donnees['id_capteur'];
        $etat = $donnees['etat'];

        $requete = "INSERT INTO etat (id_capteur, etat, date_heure) VALUES (:id_capteur, :etat, NOW())";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->bindValue(':id_capteur', $id_capteur, PDO::PARAM_INT);
        $req_prep->bindValue(':etat', $etat);
        $req_prep->execute();
        $req_prep->closeCursor();

        http_response_code(201);
        echo json_encode(["message" => "Etat ajouté"]);
    }

    // POST /capteur/configuration
    elseif (count($req_data) == 3 && $req_data[1] == 'capteur' && $req_data[2] == 'configuration') {
        if (!isset($donnees['id_capteur'], $donnees['hauteur'], $donnees['eclairage'])) {
            http_response_code(400);
            echo json_encode(["erreur" => "Champs requis : id_capteur, hauteur, eclairage"]);
            die();
        }
        $id_capteur = $donnees['id_capteur'];
        $hauteur = $donnees['hauteur'];
        $eclairage = $donnees['eclairage'];

        $requete = "INSERT INTO configuration (id_capteur, hauteur, eclairage) VALUES (:id_capteur, :hauteur, :eclairage)";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->bindValue(':id_capteur', $id_capteur, PDO::PARAM_INT);
        $req_prep->bindValue(':hauteur', $hauteur);
        $req_prep->bindValue(':eclairage', $eclairage);
        $req_prep->execute();
        $req_prep->closeCursor();

        http_response_code(201);
        echo json_encode(["message" => "Configuration ajoutée"]);
    }

    // POST /login
    elseif (count($req_data) == 2 && $req_data[1] == 'login') {
        if (!isset($donnees['login'], $donnees['password'])) {
            http_response_code(400);
            echo json_encode(["erreur" => "Champs requis : login, password"]);
            die();
        }
        $login = $donnees['login'];
        $password = $donnees['password'];

        $requete = "SELECT * FROM utilisateurs WHERE login = :login";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->bindValue(':login', $login);
        $req_prep->execute();
        $utilisateur = $req_prep->fetch(PDO::FETCH_ASSOC);

        // Pour ce projet, on accepte le mot de passe en clair ou haché (si on veut être propre)
        // Ici on compare en clair comme dans connexion.php
        if ($utilisateur && $password == $utilisateur['mot_de_passe']) {
            echo json_encode([
                "success" => true,
                "message" => "Connexion réussie",
                "user" => [
                    "id" => $utilisateur['id_user'],
                    "login" => $utilisateur['login'],
                    "role" => $utilisateur['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["success" => false, "erreur" => "Identifiants incorrects"]);
        }
    }
}

//.................. Pour le PUT...........

if ($req_methode == 'PUT') {
    $donnees_json = file_get_contents('php://input');
    $donnees = json_decode($donnees_json, true);

    // PUT /capteur/{id}
    if (count($req_data) == 3 && $req_data[1] == 'capteur' && is_numeric($req_data[2])) {
        if (!isset($donnees['nom'], $donnees['type'], $donnees['numero'], $donnees['description'])) {
            http_response_code(400);
            echo json_encode(["erreur" => "Champs requis : nom, type, numero, description"]);
            die();
        }
        $id = (int)$req_data[2];
        $nom = $donnees['nom'];
        $type = $donnees['type'];
        $numero = $donnees['numero'];
        $description = $donnees['description'];

        $requete = "UPDATE capteur SET nom = :nom, type = :type, numero = :numero, description = :description WHERE id = :id";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->bindValue(':nom', $nom);
        $req_prep->bindValue(':type', $type);
        $req_prep->bindValue(':numero', $numero);
        $req_prep->bindValue(':description', $description);
        $req_prep->bindValue(':id', $id, PDO::PARAM_INT);
        $req_prep->execute();
        $req_prep->closeCursor();

        echo json_encode(["message" => "Capteur modifié"]);
    }

    // PUT /capteur/etat/{id}
    elseif (count($req_data) == 4 && $req_data[1] == 'capteur' && $req_data[2] == 'etat') {
        if (!isset($donnees['etat'])) {
            http_response_code(400);
            echo json_encode(["erreur" => "Champ requis : etat"]);
            die();
        }
        $id = (int)$req_data[3];
        $etat = $donnees['etat'];

        $requete = "UPDATE etat SET etat = :etat WHERE id_capteur = :id ORDER BY id DESC LIMIT 1";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->bindValue(':etat', $etat);
        $req_prep->bindValue(':id', $id, PDO::PARAM_INT);
        $req_prep->execute();
        $req_prep->closeCursor();

        echo json_encode(["message" => "Etat modifié"]);
    }

    // PUT /capteur/configuration/{id}
    elseif (count($req_data) == 4 && $req_data[1] == 'capteur' && $req_data[2] == 'configuration') {
        if (!isset($donnees['hauteur'], $donnees['eclairage'])) {
            http_response_code(400);
            echo json_encode(["erreur" => "Champs requis : hauteur, eclairage"]);
            die();
        }
        $id = (int)$req_data[3];
        $hauteur = $donnees['hauteur'];
        $eclairage = $donnees['eclairage'];

        $requete = "UPDATE configuration SET hauteur = :hauteur, eclairage = :eclairage WHERE id_capteur = :id";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->bindValue(':hauteur', $hauteur);
        $req_prep->bindValue(':eclairage', $eclairage);
        $req_prep->bindValue(':id', $id, PDO::PARAM_INT);
        $req_prep->execute();
        $req_prep->closeCursor();

        echo json_encode(["message" => "Configuration modifiée"]);
    }
}

//.................. Pour le DELETE...........

if ($req_methode == 'DELETE') {

    // DELETE /capteur/{id}
    if (count($req_data) == 3 && $req_data[1] == 'capteur' && is_numeric($req_data[2])) {
        $id = (int)$req_data[2];

        $requeteEtat = "DELETE FROM etat WHERE id_capteur = :id";
        $req_prep = $maConnexion->prepare($requeteEtat);
        $req_prep->bindValue(':id', $id, PDO::PARAM_INT);
        $req_prep->execute();
        $req_prep->closeCursor();

        $requeteConfig = "DELETE FROM configuration WHERE id_capteur = :id";
        $req_prep = $maConnexion->prepare($requeteConfig);
        $req_prep->bindValue(':id', $id, PDO::PARAM_INT);
        $req_prep->execute();
        $req_prep->closeCursor();

        $requeteCapteur = "DELETE FROM capteur WHERE id = :id";
        $req_prep = $maConnexion->prepare($requeteCapteur);
        $req_prep->bindValue(':id', $id, PDO::PARAM_INT);
        $req_prep->execute();
        $req_prep->closeCursor();

        echo json_encode(["message" => "Capteur supprimé"]);
    }

    // DELETE /capteur/etat/{id}
    elseif (count($req_data) == 4 && $req_data[1] == 'capteur' && $req_data[2] == 'etat') {
        $id = (int)$req_data[3];

        $requete = "DELETE FROM etat WHERE id_capteur = :id";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->bindValue(':id', $id, PDO::PARAM_INT);
        $req_prep->execute();
        $req_prep->closeCursor();

        echo json_encode(["message" => "Etats supprimés"]);
    }

    // DELETE /capteur/configuration/{id}
    elseif (count($req_data) == 4 && $req_data[1] == 'capteur' && $req_data[2] == 'configuration') {
        $id = (int)$req_data[3];

        $requete = "DELETE FROM configuration WHERE id_capteur = :id";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->bindValue(':id', $id, PDO::PARAM_INT);
        $req_prep->execute();
        $req_prep->closeCursor();

        echo json_encode(["message" => "Configuration supprimée"]);
    }
}

?>
