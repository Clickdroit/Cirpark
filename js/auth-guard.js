/**
 * Script de protection des pages
 * Vérifie si l'utilisateur est connecté via le localStorage
 */
(function() {
    const user = localStorage.getItem('user');
    const isLoginPage = window.location.pathname.includes('Formulaire2.html');

    // 1. Redirection si non connecté et qu'on n'est pas déjà sur la page de login
    if (!user && !isLoginPage) {
        // On détermine le chemin vers la page de login selon où on se trouve
        let loginPath = 'authentification/Formulaire2.html';
        if (window.location.pathname.includes('/html/') || window.location.pathname.includes('/plan/')) {
            loginPath = '../' + loginPath;
        }
        window.location.replace(loginPath);
        return; // On arrête l'exécution du script
    }

    // 2. Redirection si déjà connecté et qu'on tente d'aller sur la page de login
    if (user && isLoginPage) {
        window.location.replace('../index.html');
        return;
    }

    // 3. Gestion de l'affichage une fois la page chargée
    document.addEventListener('DOMContentLoaded', function() {
        const navUl = document.querySelector('nav ul');
        if (!navUl) return;

        if (user) {
            const userData = JSON.parse(user);
            
            // On cherche le lien de connexion pour le remplacer par Déconnexion
            const links = navUl.querySelectorAll('li a');
            links.forEach(link => {
                if (link.textContent.toLowerCase().includes('connexion')) {
                    const li = link.parentElement;
                    li.innerHTML = `<a href="#" id="logoutBtn">Déconnexion (${userData.login})</a>`;
                    
                    document.getElementById('logoutBtn').addEventListener('click', function(e) {
                        e.preventDefault();
                        localStorage.removeItem('user'); // On vide le localStorage
                        window.location.reload();
                    });
                }
            });
        }
    });
})();
