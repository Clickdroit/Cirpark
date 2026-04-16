// chart.js - Statistiques Cirpark
// Maxime, Ambre, Melissa

var occupationChart = null;
var etatChart = null;
var evolutionChart = null;

var chartOccupation = null;
var chartEtat = null;
var chartEvolution = null;

// Vérifier que le DOM est prêt
function initCharts() {
    occupationChart = document.getElementById("occupationChart");
    etatChart = document.getElementById("etatChart");
    evolutionChart = document.getElementById("evolutionChart");
    
    if (!occupationChart || !etatChart || !evolutionChart) {
        console.error("Erreur : éléments de graphique non trouvés");
        return false;
    }
    return true;
}

// ========== 1. Camembert d'occupation =========
function creerChartOccupation(totalLibre, totalOccupee) {
	if (chartOccupation) chartOccupation.destroy();

	chartOccupation = new Chart(occupationChart, {
		type: "pie",
		data: {
			labels: ["Libre", "Occupé"],
			datasets: [{
				data: [totalLibre, totalOccupee],
				backgroundColor: ["#2ecc71", "#e74c3c"]
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: "bottom",
					labels: { font: { size: 13 } }
				}
			}
		}
	});
}	
function creerChartEtat(totalNormale, totalInterdit, totalReserve, totalHandicape) {
	if (chartEtat) chartEtat.destroy();

	chartEtat = new Chart(etatChart, {
		type: "bar",
		data: {
			labels: ["Normale", "Interdit", "Réservé", "Handicapé"],
			datasets: [{
				label: "Nombre de places",
				data: [totalNormale, totalInterdit, totalReserve, totalHandicape],
				backgroundColor: ["#2ecc71", "#e74c3c", "#f1c40f", "#006eff"]
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					beginAtZero: true,
				}
			},
			plugins: {
				legend: {
					position: "bottom",
					labels: { font: { size: 13 } }
				}
			}
		}
	});
}
function creerChartEvolution(heureOccupation, heureLibre) {
	if (chartEvolution) chartEvolution.destroy();
	chartEvolution = new Chart(evolutionChart,{
		type: "line",
		data:{

			labels: ["0h", "2h", "4h", "6h", "8h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"],
			datasets:[{
				label: "Occupation",
				data: heureOccupation,
			}, {
				label: "Libre",
				data: heureLibre,
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: "bottom",
					labels: { font: { size: 13 } }
				}
			},
			scales: {
				y: {
					beginAtZero: true,
				}
			}
		},
	});
}
function totalCapteur() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var donnees = JSON.parse(this.responseText);
			var totalLibre = 0;
			var totalOccupee = 0;


			for (var i = 0; i < donnees.length; i++) {
				if (donnees[i].etat == "Libre") {
					totalLibre++;
				} else {
					totalOccupee++;
				}
			}

			creerChartOccupation(totalLibre, totalOccupee);			
		}
	};
	xhttp.open("GET", "../rest.php/capteur");
	xhttp.send();

	var xhttp2 = new XMLHttpRequest();

	xhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var type = JSON.parse(this.responseText);
			var totalNormale = 0;
			var totalInterdit = 0;
			var totalReserve = 0;
			var totalHandicape = 0;
			for (var i = 0; i < type.length; i++) {
				if (type[i].type == "Normale") {
					totalNormale++;
				} else if (type[i].type == "Interdit") {
					totalInterdit++;
				} else if (type[i].type == "Reserve") {
					totalReserve++;
				} else if (type[i].type == "Handicape") {
					totalHandicape++;
				}
			}
			creerChartEtat(totalNormale, totalInterdit, totalReserve, totalHandicape);
		}
	};	
	xhttp2.open("GET", "../rest.php/capteur");
	xhttp2.send();

	var xhttp3 = new XMLHttpRequest();

	xhttp3.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var historique = JSON.parse(this.responseText);
			var heureOccupation = new Array(12).fill(0);
			var heureLibre = new Array(12).fill(0);
			for (var i = 0; i < historique.length; i++) {
				var date_heure = new Date(historique[i].date_heure).getHours();
				if (historique[i].etat == "Occupee") {
					heureOccupation[Math.floor(date_heure / 2)]++;
				} else if (historique[i].etat == "Libre") {
					heureLibre[Math.floor(date_heure / 2)]++;
				}
			}
			creerChartEvolution(heureOccupation, heureLibre);
		}
	};	
	xhttp3.open("GET", "../rest.php/capteur/etat");
	xhttp3.send();
}
function chargerStatistiques() {
	if (initCharts()) {
		totalCapteur();
	}
}

chargerStatistiques();

