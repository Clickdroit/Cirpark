// chart.js helper for Cirpark.
// Usage example in HTML: <canvas id="occupationChart"></canvas>
// Then call: window.createCirparkChart('occupationChart', {...})

(function () {
	function createCirparkChart(canvasId, config) {
		var canvas = document.getElementById(canvasId);

		if (!canvas) {
			console.warn("Chart.js: canvas introuvable:", canvasId);
			return null;
		}

		if (typeof Chart === "undefined") {
			console.error("Chart.js n'est pas charge.");
			return null;
		}

		return new Chart(canvas, config);
	}

	window.createCirparkChart = createCirparkChart;
})();
