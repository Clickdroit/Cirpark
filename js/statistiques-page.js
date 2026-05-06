import { initTheme } from './theme.js';

initTheme();

const btn = document.getElementById('refreshbtn');
if (btn && typeof chargerStatistiques === 'function') {
    btn.addEventListener('click', chargerStatistiques);
}

const chartAutoRefreshToggle = document.getElementById('chartAutoRefreshToggle');
const chartRefreshInterval = document.getElementById('chartRefreshInterval');

if (chartAutoRefreshToggle && chartRefreshInterval) {
    chartAutoRefreshToggle.addEventListener('change', function () {
        if (this.checked) {
            if (typeof enableChartAutoRefresh === 'function') {
                enableChartAutoRefresh(parseInt(chartRefreshInterval.value, 10));
            }
        } else if (typeof disableChartAutoRefresh === 'function') {
            disableChartAutoRefresh();
        }
    });

    chartRefreshInterval.addEventListener('change', function () {
        if (chartAutoRefreshToggle.checked) {
            if (typeof disableChartAutoRefresh === 'function') {
                disableChartAutoRefresh();
            }
            if (typeof enableChartAutoRefresh === 'function') {
                enableChartAutoRefresh(parseInt(this.value, 10));
            }
        }
    });
}
