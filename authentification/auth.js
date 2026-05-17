document.addEventListener('DOMContentLoaded', function() {
    
    // On récupère l'élément formulaire
    var monForm = document.querySelector('form');

    monForm.addEventListener('submit', function(e) {
        // Empêcher le rechargement de la page
        e.preventDefault();

        // Récupérer les valeurs tapées par l'utilisateur
        var loginSaisi = document.querySelector('input[type="text"]').value;
        var mdpSaisi = document.querySelector('input[type="password"]').value;

        // Préparer les données à envoyer
        var data = {
            login: loginSaisi,
            password: mdpSaisi
        };

        // Appel à l'API de connexion
        fetch('../rest.php/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert("Connexion réussie ! Bienvenue " + result.user.login);
                // On stocke les infos de l'utilisateur dans localStorage pour la persistance
                localStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = "../index.html"; // Redirection vers l'accueil
            } else {
                alert("Erreur : " + (result.erreur || "Identifiants incorrects"));
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert("Une erreur est survenue lors de la connexion.");
        });
    });
});