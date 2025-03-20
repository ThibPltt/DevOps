document.addEventListener("DOMContentLoaded", () => {
    // Gestion des boutons de navigation
    const setupNavigation = () => {
        const buttons = {
            navigateButton: "page2.html",
            backButton: "index.html",
            aboutButton: "apropos.html",
            contactButton: "contact.html"
        };

        Object.keys(buttons).forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener("click", () => {
                    window.location.href = buttons[id];
                });
            }
        });
    };

    // Initialisation de la carte et gestion du périmètre dynamique
    const initMap = () => {
        const mapDiv = document.getElementById("map");
        if (mapDiv) {
            const map = L.map("map").setView([48.0, 0.2], 13); // Centre initial (Le Mans)

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "&copy; OpenStreetMap contributors"
            }).addTo(map);

            let circle = null; // Stocker le cercle pour mise à jour

            // Demande de localisation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    const { latitude, longitude } = position.coords;
                    map.setView([latitude, longitude], 14);

                    // Ajout du marqueur
                    L.marker([latitude, longitude]).addTo(map)
                        .bindPopup("Vous êtes ici")
                        .openPopup();

                    // Création du cercle initial avec 1 km de rayon
                    circle = L.circle([latitude, longitude], {
                        color: "blue",
                        fillColor: "blue",
                        fillOpacity: 0.2,
                        radius: 1000 // 1 km
                    }).addTo(map);

                    // Gestion du slider pour modifier la distance
                    const distanceRange = document.getElementById("distanceRange");
                    const distanceValue = document.getElementById("distanceValue");

                    distanceRange.addEventListener("input", () => {
                        const newRadius = distanceRange.value * 1000; // Convertir en mètres
                        distanceValue.textContent = distanceRange.value; // Mettre à jour l'affichage
                        circle.setRadius(newRadius); // Modifier le rayon du cercle
                    });

                }, () => {
                    alert("Impossible de récupérer votre localisation.");
                });
            } else {
                alert("La géolocalisation n'est pas supportée par votre navigateur.");
            }
        }
    };

    // Exécution des fonctions
    setupNavigation();
    initMap();
});
