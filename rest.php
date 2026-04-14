<?php
try {
    $maConnexion = new PDO("mysql:host=localhost;port=3306;dbname=cirpark", "root", "");
} catch (PDOException $e) {
    echo("ERREUR DB \r\n");
    die();
}
$req_methode = $_SERVER['REQUEST_METHOD'];
$req_data = [];

if (isset($_SERVER['PATH_INFO'])) {
    $req_path = $_SERVER['PATH_INFO'];
    $req_data = explode('/', $req_path);
}

if ($req_methode == 'GET') {
    if (count($req_data) == 2 && $req_data[1] == 'capteur') {
        $requete = "SELECT capteur.id, capteur.nom, capteur.type, capteur.numero, etat.etat, etat.date_heure, configuration.hauteur, configuration.eclairage 
                    FROM capteur, etat, configuration 
                    WHERE capteur.id = etat.id_capteur 
                    AND capteur.id = configuration.id_capteur 
                    AND etat.id IN (SELECT MAX(id) FROM etat GROUP BY id_capteur)";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->execute();
        $resultat = $req_prep->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($resultat);
    }

    if (count($req_data) == 3 && $req_data[1] == 'capteur' && $req_data[2] == 'etat') {
        $requete = "SELECT * FROM etat";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->execute();
        $resultat = $req_prep->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($resultat);
    }

    if (count($req_data) == 4 && $req_data[1] == 'capteur' && $req_data[2] == 'etat') {
        $id = (int)$req_data[3];
        $requete = "SELECT * FROM etat WHERE id_capteur = :id ORDER BY date_heure DESC";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->bindValue(':id', $id, PDO::PARAM_INT);
        $req_prep->execute();
        $resultat = $req_prep->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($resultat);
    }

    if (count($req_data) == 3 && $req_data[1] == 'capteur' && $req_data[2] == 'configuration') {
        $requete = "SELECT * FROM configuration";
        $req_prep = $maConnexion->prepare($requete);
        $req_prep->execute();
        $resultat = $req_prep->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($resultat);
    }
    if (count($req_data) == 4 && $req_data[1] == 'capteur' && $req_data[2] == 'configuration') {
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

// if ($req_methode == 'POST') {

    // Ajouter un état
    //if (count($req_data) == 3 && $req_data[1] == 'capteur' && $req_data[2] == 'etat') {

        //$input = json_decode(file_get_contents("php://input"), true);

       // $requete = "INSERT INTO etat (id_capteur, etat, date_heure) 
                    //VALUES (:id_capteur, :etat, NOW())";

        //$req_prep = $maConnexion->prepare($requete);
       // $req_prep->bindValue(':id_capteur', $input['id_capteur'], PDO::PARAM_INT);
        //$req_prep->bindValue(':etat', $input['etat']);
        //$req_prep->execute();

       // echo json_encode(["message" => "Etat ajouté"]);
    //}

    // Ajouter une configuration
    //if (count($req_data) == 3 && $req_data[1] == 'capteur' && $req_data[2] == 'configuration') {

        //$input = json_decode(file_get_contents("php://input"), true);

        //$requete = "INSERT INTO configuration (id_capteur, hauteur, eclairage) 
                    //VALUES (:id_capteur, :hauteur, :eclairage)";

        //$req_prep = $maConnexion->prepare($requete);
        //$req_prep->bindValue(':id_capteur', $input['id_capteur'], PDO::PARAM_INT);
        //$req_prep->bindValue(':hauteur', $input['hauteur']);
        //$req_prep->bindValue(':eclairage', $input['eclairage']);
      //  $req_prep->execute();

    //    echo json_encode(["message" => "Configuration ajoutée"]);
  //  }
//}

//.................. Pour le PUT...........

//if ($req_methode == 'PUT') {

    // Modifier un état (par id_capteur)
    //if (count($req_data) == 4 && $req_data[1] == 'capteur' && $req_data[2] == 'etat') {

        //$id = (int)$req_data[3];
        //$input = json_decode(file_get_contents("php://input"), true);

        //$requete = "UPDATE etat 
                    //SET etat = :etat 
                    //WHERE id_capteur = :id";

        //$req_prep = $maConnexion->prepare($requete);
       // $req_prep->bindValue(':etat', $input['etat']);
        //$req_prep->bindValue(':id', $id, PDO::PARAM_INT);
        //$req_prep->execute();

       // echo json_encode(["message" => "Etat modifié"]);
   // }

    // Modifier une configuration
    //if (count($req_data) == 4 && $req_data[1] == 'capteur' && $req_data[2] == 'configuration') {

      //  $id = (int)$req_data[3];
        //$input = json_decode(file_get_contents("php://input"), true);

       // $requete = "UPDATE configuration 
                  //  SET hauteur = :hauteur, eclairage = :eclairage 
                   // WHERE id_capteur = :id";

       // $req_prep = $maConnexion->prepare($requete);
       // $req_prep->bindValue(':hauteur', $input['hauteur']);
       // $req_prep->bindValue(':eclairage', $input['eclairage']);
       // $req_prep->bindValue(':id', $id, PDO::PARAM_INT);
       // $req_prep->execute();
//
      //  echo json_encode(["message" => "Configuration modifiée"]);
    //}
//}



//.................. Pour le DELETE...........

//if ($req_methode == 'DELETE') {
//
//    // Supprimer les états d’un capteur
//    if (count($req_data) == 4 && $req_data[1] == 'capteur' && $req_data[2] == 'etat') {
//
//        $id = (int)$req_data[3];
//
//        $requete = "DELETE FROM etat WHERE id_capteur = :id";
//        $req_prep = $maConnexion->prepare($requete);
//        $req_prep->bindValue(':id', $id, PDO::PARAM_INT);
//        $req_prep->execute();
//
//        echo json_encode(["message" => "Etat supprimé"]);
//    }
//
//    // Supprimer une configuration
//    if (count($req_data) == 4 && $req_data[1] == 'capteur' && $req_data[2] == 'configuration') {
//
//        $id = (int)$req_data[3];
//
//        $requete = "DELETE FROM configuration WHERE id_capteur = :id";
//        $req_prep = $maConnexion->prepare($requete);
//        $req_prep->bindValue(':id', $id, PDO::PARAM_INT);
//        $req_prep->execute();
//
//        echo json_encode(["message" => "Configuration supprimée"]);
//    }
//}

?>