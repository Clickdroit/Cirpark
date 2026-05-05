<?php
try {
    $pdo = new PDO("mysql:host=localhost;port=3306;dbname=cirpark", "root", "" );
}catch(PDOException $e) {
    echo "BDD : ECHEC\n";
    die();
}
echo "Base de données : OK\n";

while(true){
    $requete= "SELECT id, numero FROM capteur";
    $req_prep = $pdo->prepare($requete);
    $req_prep->execute();
    $resultat = $req_prep->fetchAll(PDO::FETCH_ASSOC);

    for($i=0; $i<count($resultat); $i++){
        $capteur=str_split($resultat[$i]['numero'],2);
        $adrh=$capteur[0];
        $adrl=$capteur[1];
        $codeFonction="10";
        $bcc=dechex(hexdec($adrh)+hexdec($adrl)+hexdec($codeFonction));
        $ipServeur = "172.18.112.249";
        $port = "10001";
        $message=hex2bin($adrh.$adrl.$codeFonction.$bcc);
        echo "message envoyé : ".$adrh.$adrl.$codeFonction.$bcc."\r\n";
        $sock = socket_create(AF_INET, SOCK_DGRAM, 0);
        socket_sendto($sock, $message , strlen($message) , 0 , $ipServeur , $port);
        socket_recvfrom($sock, $reponse, 2045, 0, $ipServeur, $port);
        echo "La réponse est : ". bin2hex($reponse)."\r\n";
        socket_close($sock); 
        $tableauData=str_split(bin2hex($reponse), 2);
        $etat=$tableauData[2];
        if($etat=="00") {
            $etatt = "Libre";
            echo "La place est libre ! \r\n";
        } elseif($etat=="01") {
            $etatt = "Occupee";
            echo "La place est occupée ! \r\n";
        } else {
            $etatt = "Inconnu";
            echo "Etat inconnu : " . $etat . " \r\n";
        }
        $req_insert = "INSERT INTO etat (etat, date_heure, id_capteur) VALUES (?, NOW(), ?)";
        $req_prep_insert = $pdo->prepare($req_insert);
        $req_prep_insert->bindParam(1, $etatt);
        $req_prep_insert->bindParam(2, $resultat[$i]["id"]);
        $req_prep_insert->execute();
        print_r("\r\n------------------------------------------------------------------------------------------------\r\n\r\n");
    }
    sleep(60);
}
?>  