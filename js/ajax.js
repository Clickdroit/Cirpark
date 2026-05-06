// ajax.js - Projet Cirpark
// Maxime, Ambre, Melissa
var elPlan = document.getElementById('planNAV');
var elCapteurs = document.getElementById('capteursNAV');
if (elPlan) elPlan.addEventListener('click', AfficherPlanHTML);
if (elCapteurs) elCapteurs.addEventListener('click', AfficherListeHTML);
setInterval(function() {
    var el = document.getElementById('horloge');
    if (el) {
        var date = new Date();
        el.innerHTML = date.toLocaleString('fr-FR');
    }
}, 1000);

// Variables d'auto-refresh
var autoRefreshEnabled = false;
var autoRefreshInterval = 5000; // 5 secondes par défaut
var planRefreshId = null;
var capteurRefreshId = null;

// Fonction pour activer l'auto-refresh
function enableAutoRefresh(interval) {
    autoRefreshEnabled = true;
    if (interval) autoRefreshInterval = interval;
    restartAutoRefresh();
}

// Fonction pour redémarrer l'auto-refresh en fonction du contenu visible
function restartAutoRefresh() {
    // Arrêter les intervalles existants
    if (planRefreshId) clearInterval(planRefreshId);
    if (capteurRefreshId) clearInterval(capteurRefreshId);
    planRefreshId = null;
    capteurRefreshId = null;
    
    if (!autoRefreshEnabled) return;
    
    // Auto-refresh du plan si visible
    if (document.getElementById('parking')) {
        planRefreshId = setInterval(function() {
            AfficherPlanHTML();
        }, autoRefreshInterval);
    }
    
    // Auto-refresh de la liste si visible
    if (document.querySelectorAll('.capteur-table').length > 0) {
        capteurRefreshId = setInterval(function() {
            AfficherListeHTML();
        }, autoRefreshInterval);
    }
}

// Fonction pour désactiver l'auto-refresh
function disableAutoRefresh() {
    autoRefreshEnabled = false;
    if (planRefreshId) clearInterval(planRefreshId);
    if (capteurRefreshId) clearInterval(capteurRefreshId);
    planRefreshId = null;
    capteurRefreshId = null;
}

function escapeHtml(valeur) {
    if (valeur === null || valeur === undefined) return "";
    return String(valeur)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function envoyerRequeteJSON(methode, url, donnees, callbackSucces) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status >= 200 && this.status < 300) {
                if (callbackSucces) callbackSucces(this.responseText);
            } else {
                alert("Erreur lors de la requête (" + this.status + ")");
            }
        }
    };
    xhttp.open(methode, url);
    if (donnees) {
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(donnees));
    } else {
        xhttp.send();
    }
}

// Event listeners pour les contrôles d'auto-refresh (si sur la page d'accueil)
document.addEventListener('DOMContentLoaded', function() {
    var autoRefreshToggle = document.getElementById('autoRefreshToggle');
    var refreshInterval = document.getElementById('refreshInterval');
    
    if (autoRefreshToggle) {
        autoRefreshToggle.addEventListener('change', function() {
            if (this.checked) {
                enableAutoRefresh(parseInt(refreshInterval.value));
            } else {
                disableAutoRefresh();
            }
        });
    }
    
    if (refreshInterval) {
        refreshInterval.addEventListener('change', function() {
            if (autoRefreshToggle && autoRefreshToggle.checked) {
                autoRefreshInterval = parseInt(this.value);
                restartAutoRefresh();
            }
        });
    }
});

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
                        html += "<div class='" + couleur + "' data-info='" + texte + "' onclick='AfficherDetailsCapteur(" + capteur.id + ")' title='Voir la fiche'>" + contenuPlace + "</div>";
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
            restartAutoRefresh();
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
            var html = "<h3>Liste des Capteurs (Cliquez sur un capteur pour voir sa fiche)</h3>";
            html += "<div class='capteur-table'>";
            html += "<table>";
            html += "<tr><th>Nom</th><th>Type</th><th>Numéro</th><th>Etat</th><th>Hauteur</th><th>Éclairage</th></tr>";

            // On parcourt tous les capteurs
            for (var i = 0; i < donnees.length; i++) {
                var capteur = donnees[i];
                // On choisit la couleur selon l'etat
                var couleur = (capteur.etat == "Libre") ? "vert" : "rouge";
                // Quand on clique sur la ligne ca ouvre la fiche
                html += "<tr onclick='AfficherDetailsCapteur(" + capteur.id + ")' style='cursor:pointer;' title='Voir la fiche'>";
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
            restartAutoRefresh();
        }
    };

    xhttp.open("GET", "rest.php/capteur");
    xhttp.send();
}

function AfficherDetailsCapteur(idCapteur) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var donnees = JSON.parse(this.responseText);
                var capteur = Array.isArray(donnees) ? donnees[0] : donnees;
                var section = document.getElementById("section");

                if (!capteur) {
                    section.innerHTML = "<p class='texte-attente'>Capteur introuvable.</p>";
                    return;
                }

                var nom = escapeHtml(capteur.nom);
                var type = escapeHtml(capteur.type);
                var numero = escapeHtml(capteur.numero);
                var description = escapeHtml(capteur.description);
                var hauteur = escapeHtml(capteur.hauteur);
                var eclairage = escapeHtml(capteur.eclairage);
                var etat = escapeHtml(capteur.etat || "Inconnu");
                var dateHeure = escapeHtml(capteur.date_heure || "-");

                var html = "<div class='btn-group'>";
                html += "<button class='btn-gris' onclick='AfficherListeHTML()'>⬅ Retour aux Capteurs</button>";
                html += "<button class='btn-gris' onclick='AfficherHistoriqueCapteur(" + idCapteur + ")'>Historique</button>";
                html += "</div>";
                html += "<h3>Fiche du Capteur N°" + idCapteur + "</h3>";
                html += "<div class='capteur-details'>";
                html += "<div class='capteur-grid'>";

                html += "<div class='capteur-card'>";
                html += "<h4>Informations</h4>";
                html += "<div class='capteur-form'>";
                html += "<label for='capteur-nom'>Nom</label>";
                html += "<input id='capteur-nom' type='text' value='" + nom + "'>";
                html += "<label for='capteur-type'>Type</label>";
                html += "<input id='capteur-type' type='text' value='" + type + "'>";
                html += "<label for='capteur-numero'>Numéro</label>";
                html += "<input id='capteur-numero' type='text' value='" + numero + "'>";
                html += "<label for='capteur-description'>Description</label>";
                html += "<textarea id='capteur-description' rows='3'>" + description + "</textarea>";
                html += "</div>";
                html += "<div class='form-actions'>";
                html += "<button class='btn-action' onclick='EnregistrerCapteur(" + idCapteur + ")'>Enregistrer</button>";
                html += "</div>";
                html += "</div>";

                html += "<div class='capteur-card'>";
                html += "<h4>Configuration</h4>";
                html += "<div class='capteur-form'>";
                html += "<label for='capteur-hauteur'>Hauteur</label>";
                html += "<input id='capteur-hauteur' type='number' value='" + hauteur + "'>";
                html += "<label for='capteur-eclairage'>Éclairage</label>";
                html += "<input id='capteur-eclairage' type='text' value='" + eclairage + "'>";
                html += "</div>";
                html += "<div class='form-actions'>";
                html += "<button class='btn-action' onclick='EnregistrerConfiguration(" + idCapteur + ")'>Enregistrer</button>";
                html += "</div>";
                html += "</div>";

                html += "<div class='capteur-card'>";
                html += "<h4>État</h4>";
                html += "<div class='capteur-form'>";
                html += "<label for='capteur-etat'>État actuel</label>";
                html += "<select id='capteur-etat'>";
                html += "<option value='Libre'" + (etat === "Libre" ? " selected" : "") + ">Libre</option>";
                html += "<option value='Occupee'" + (etat === "Occupee" ? " selected" : "") + ">Occupée</option>";
                if (etat !== "Libre" && etat !== "Occupee") {
                    html += "<option value='" + etat + "' selected>" + etat + "</option>";
                }
                html += "</select>";
                html += "<div class='capteur-meta'>Dernière mise à jour : " + dateHeure + "</div>";
                html += "</div>";
                html += "<div class='form-actions'>";
                html += "<button class='btn-action' onclick='MettreAJourEtat(" + idCapteur + ")'>Mettre à jour</button>";
                html += "<button class='btn-danger' onclick='SupprimerCapteur(" + idCapteur + ")'>Supprimer</button>";
                html += "</div>";
                html += "</div>";

                html += "</div>";
                html += "</div>";

                section.innerHTML = html;
                restartAutoRefresh();
            } else {
                alert("Erreur lors du chargement du capteur (" + this.status + ")");
            }
        }
    };

    xhttp.open("GET", "rest.php/capteur/" + idCapteur);
    xhttp.send();
}

function EnregistrerCapteur(idCapteur) {
    var nom = document.getElementById("capteur-nom").value.trim();
    var type = document.getElementById("capteur-type").value.trim();
    var numero = document.getElementById("capteur-numero").value.trim();
    var description = document.getElementById("capteur-description").value.trim();

    if (!nom || !type || !numero) {
        alert("Veuillez renseigner le nom, le type et le numéro.");
        return;
    }

    envoyerRequeteJSON("PUT", "rest.php/capteur/" + idCapteur, {
        nom: nom,
        type: type,
        numero: numero,
        description: description
    }, function() {
        AfficherDetailsCapteur(idCapteur);
    });
}

function EnregistrerConfiguration(idCapteur) {
    var hauteur = document.getElementById("capteur-hauteur").value.trim();
    var eclairage = document.getElementById("capteur-eclairage").value.trim();

    if (!hauteur || !eclairage) {
        alert("Veuillez renseigner la hauteur et l'éclairage.");
        return;
    }

    envoyerRequeteJSON("PUT", "rest.php/capteur/configuration/" + idCapteur, {
        hauteur: hauteur,
        eclairage: eclairage
    }, function() {
        AfficherDetailsCapteur(idCapteur);
    });
}

function MettreAJourEtat(idCapteur) {
    var etat = document.getElementById("capteur-etat").value;
    envoyerRequeteJSON("PUT", "rest.php/capteur/etat/" + idCapteur, {
        etat: etat
    }, function() {
        AfficherDetailsCapteur(idCapteur);
    });
}

function SupprimerCapteur(idCapteur) {
    if (!confirm("Supprimer ce capteur et ses données associées ?")) {
        return;
    }
    envoyerRequeteJSON("DELETE", "rest.php/capteur/" + idCapteur, null, function() {
        AfficherListeHTML();
    });
}

// Cette fonction affiche l'historique d'un seul capteur
function AfficherHistoriqueCapteur(idCapteur) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var donnees = JSON.parse(this.responseText);
            var section = document.getElementById("section");

            // Boutons de retour
            var html = "<div class='btn-group'>";
            html += "<button class='btn-gris' onclick='AfficherDetailsCapteur(" + idCapteur + ")'>⬅ Retour au Capteur</button>";
            html += "<button class='btn-gris' onclick='AfficherListeHTML()'>Retour aux Capteurs</button>";
            html += "</div>";
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
            restartAutoRefresh();
        }
    };

    xhttp.open("GET", "rest.php/capteur/etat/" + idCapteur);
    xhttp.send();
}
