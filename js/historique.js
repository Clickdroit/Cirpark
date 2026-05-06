// historique.js
// Affiche l'historique des changements de capteurs dans la table #historiqueTableBody
// Format attendu pour chaque entrée: { timestamp: '2026-05-06T12:34:56', sensor: 'SP1704', from: 'Libre', to: 'Occupée' }

(function () {
    const tableBody = document.getElementById('historiqueTableBody');
    const emptyEl = document.getElementById('historiqueEmpty');

    function formatDate(iso) {
        const d = new Date(iso);
        if (isNaN(d)) return iso;
        const pad = (n) => String(n).padStart(2, '0');
        return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    function render(entries) {
        tableBody.innerHTML = '';
        if (!entries || entries.length === 0) {
            emptyEl.textContent = 'Aucun historique disponible.';
            return;
        }
        emptyEl.textContent = '';
        entries.forEach(e => {
            const tr = document.createElement('tr');

            const tdDate = document.createElement('td');
            tdDate.textContent = formatDate(e.timestamp || e.date || '');

            const tdSensor = document.createElement('td');
            tdSensor.textContent = e.sensor || e.capteur || '';

            const tdEvent = document.createElement('td');
            const from = e.from || e.ancien || '';
            const to = e.to || e.nouveau || '';
            tdEvent.textContent = `${from} -> ${to}`;

            tr.appendChild(tdDate);
            tr.appendChild(tdSensor);
            tr.appendChild(tdEvent);
            tableBody.appendChild(tr);
        });
    }

    // Sample fallback data to display while no backend is configured
    const sampleData = [
        { timestamp: new Date().toISOString(), sensor: 'SP1704', from: 'Libre', to: 'Occupée' },
        { timestamp: new Date(Date.now() - 1000*60*5).toISOString(), sensor: 'SP1703', from: 'Occupée', to: 'Libre' },
        { timestamp: new Date(Date.now() - 1000*60*60).toISOString(), sensor: 'SP1699', from: 'Libre', to: 'Occupée' }
    ];

    // Try to fetch from a backend endpoint /api/historique (change as needed). If fetch fails, use sampleData.
    const endpoint = '/api/historique';

    function load() {
        // Small delay to simulate loading UX
        emptyEl.textContent = 'Chargement de l\'historique...';
        if (!window.fetch) {
            render(sampleData);
            return;
        }
        fetch(endpoint, { cache: 'no-store' })
            .then(r => {
                if (!r.ok) throw new Error('Pas d\'endpoint disponible');
                return r.json();
            })
            .then(data => {
                // Expecting an array; if object has a field 'items', use that
                const items = Array.isArray(data) ? data : (data.items || []);
                if (!items || items.length === 0) render(sampleData);
                else render(items);
            })
            .catch(err => {
                console.warn('Impossible de charger /api/historique, fallback aux données sample', err);
                render(sampleData);
            });
    }

    // On DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', load);
    } else {
        load();
    }
})();
