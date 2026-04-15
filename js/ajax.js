// ajax.js - Projet Cirpark
// Maxime, Ambre, Melissa
var elPlan = document.getElementById('planNAV');
var elCapteurs = document.getElementById('capteursNAV');
var elStats = document.getElementById('Statistiques');
var elAccueil = document.getElementById('Accueil');
if (elPlan) elPlan.addEventListener('click', AfficherPlanHTML);
if (elCapteurs) elCapteurs.addEventListener('click', AfficherListeHTML);
if (elStats) elStats.addEventListener('click', stat);
if (elAccueil) elAccueil.addEventListener('click', acceuil);
function acceuil() {
    window.location.href = "../index.html";
}
function stat() {
    window.location.href = "html/statistiques.html";
}
setInterval(function() {
    var date = new Date();
    document.getElementById('horloge').innerHTML = date.toLocaleString('fr-FR');
}, 1000);

function AfficherPlanHTML() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var reponse = this.responseText;
            var donnees = JSON.parse(reponse);
            var section = document.getElementById("section");

            var totalLibre = 0;
            var totalOccupee = 0;

            // On construit le HTML du parking
            var html = "<h3>Plan du Parking</h3><br>";
            html += "<div id='parking'>";
            var index = 0;

            // On fait 4 rangées de 16 places
            for (var n = 1; n <= 4; n++) {
                html += "<div id='range" + n + "'>";
                for (var p = 0; p < 16; p++) {
                    if (index < donnees.length) {
                        var capteur = donnees[index];

                        // Si le capteur est libre on met vert, sinon rouge et on ajoute une image de voiture
                        var estLibre = (capteur.etat == "Libre");
                        if (estLibre) {
                            totalLibre++;
                        } else {
                            totalOccupee++;
                        }
                        var couleur = estLibre ? "place vert" : "place rouge";
                        // On choisit une image de voiture parmi les 4 disponibles dans le dossier plan/
                        var numVoiture = (index % 4) + 1;
                        var contenuPlace = estLibre ? "" : "<img src='plan/voiture" + numVoiture + ".png' class='voiture-img' alt='Voiture'>";
                        // Texte qui s'affiche au survol de la souris
                        var texte = "Capteur " + capteur.nom + " | " + capteur.etat + " depuis le " + capteur.date_heure;
                        html += "<div class='" + couleur + "' data-info='" + texte + "'>" + contenuPlace + "</div>";
                    } else {
                        html += "<div class='place'></div>";
                    }
                    index++;
                }
                html += "</div>";
                // On ajoute un chemin entre la rangée 1-2 et 3-4
                if (n == 1 || n == 3) {
                    html += "<div id='chemin'></div>";
                }
            }
            html += "</div>";
            // Résumé des places
            html += "<div class='resume-parking'>";
            html += "<p><strong>Places Libres :</strong> <span class='texte-vert'>" + totalLibre + "</span></p>";
            html += "<p><strong>Places Occupées :</strong> <span class='texte-rouge'>" + totalOccupee + "</span></p>";
            html += "</div>";
            
            section.innerHTML = html;
        }
    };

    xhttp.open("GET", "rest.php/capteur");
    xhttp.send();
}

// Cette fonction affiche la liste des capteurs dans un tableau
function AfficherListeHTML() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var reponse = this.responseText;
            var donnees = JSON.parse(reponse);
            var section = document.getElementById("section");

            // Creation du tableau HTML
            var html = "<h3>Liste des Capteurs (Cliquez sur un capteur pour voir son historique)</h3>";
            html += "<div class='capteur-table'>";
            html += "<table>";
            html += "<tr><th>Nom</th><th>Type</th><th>Numéro</th><th>Etat</th><th>Hauteur</th><th>Éclairage</th></tr>";

            // On parcourt tous les capteurs
            for (var i = 0; i < donnees.length; i++) {
                var capteur = donnees[i];
                // On choisit la couleur selon l'etat
                var couleur = (capteur.etat == "Libre") ? "vert" : "rouge";
                // Quand on clique sur la ligne ca ouvre l'historique
                html += "<tr onclick='AfficherHistoriqueCapteur(" + capteur.id + ")' style='cursor:pointer;' title='Voir Historique'>";
                html += "<td>" + capteur.nom + "</td>";
                html += "<td>" + capteur.type + "</td>";
                html += "<td>" + capteur.numero + "</td>";
                html += "<td class='" + couleur + "'>" + capteur.etat + "</td>";
                html += "<td>" + capteur.hauteur + "</td>";
                html += "<td>" + capteur.eclairage + "</td>";
                html += "</tr>";
            }
            html += "</table></div>";
            section.innerHTML = html;
        }
    };

    xhttp.open("GET", "rest.php/capteur");
    xhttp.send();
}

// Cette fonction affiche l'historique d'un seul capteur
function AfficherHistoriqueCapteur(idCapteur) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var donnees = JSON.parse(this.responseText);
            var section = document.getElementById("section");

            // Bouton retour pour revenir a la liste
            var html = "<button class='btn-gris' onclick='AfficherListeHTML()'>⬅ Retour aux Capteurs</button>";
            html += "<h3>Historique du Capteur N°" + idCapteur + "</h3>";
            html += "<table>";
            html += "<tr><th>Date et Heure</th><th>Etat</th></tr>";

            // On affiche chaque ligne de l'historique
            for (var i = 0; i < donnees.length; i++) {
                var ligne = donnees[i];
                var couleur = (ligne.etat == "Libre") ? "vert" : "rouge";

                html += "<tr>";
                html += "<td>" + ligne.date_heure + "</td>";
                html += "<td class='" + couleur + "'>" + ligne.etat + "</td>";
                html += "</tr>";
            }

            html += "</table>";
            section.innerHTML = html;
        }
    };

    xhttp.open("GET", "rest.php/capteur/etat/" + idCapteur);
    xhttp.send();
}
