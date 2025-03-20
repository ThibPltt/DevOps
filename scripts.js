document.addEventListener("DOMContentLoaded", () => {
    console.log("Script chargé");

    // Initialisation de la carte
    const mapDiv = document.getElementById("map");
    if (mapDiv) {
        console.log("Carte détectée, initialisation...");

        const map = L.map("map").setView([48.0, 0.2], 6); // Vue initiale centrée sur la France

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        let activeCircle = null; // Un seul cercle actif à la fois
        let activeMarker = null; // Un seul marqueur actif

        // Fonction pour mettre à jour l'affichage (supprime les anciens éléments)
        const updateLocation = (lat, lon, label, color) => {
            // Supprime les anciens cercles et marqueurs
            if (activeCircle) map.removeLayer(activeCircle);
            if (activeMarker) map.removeLayer(activeMarker);

            // Ajoute le marqueur
            activeMarker = L.marker([lat, lon]).addTo(map)
                .bindPopup(label)
                .openPopup();

            // Ajoute le cercle autour du point
            activeCircle = L.circle([lat, lon], {
                color: color,
                fillColor: color,
                fillOpacity: 0.2,
                radius: 5000 // Rayon de base 5 km
            }).addTo(map);
        };

        // Géolocalisation utilisateur
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                console.log("Localisation utilisateur obtenue !");
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 12);

                updateLocation(latitude, longitude, "Vous êtes ici", "blue");
            }, () => {
                alert("Impossible de récupérer votre localisation.");
            });
        } else {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
        }

        // Gestion de la barre de recherche pour les villes principales
        const cities = {
            "Paris": [48.8566, 2.3522],
            "Marseille": [43.2965, 5.3698],
            "Lyon": [45.7640, 4.8357],
            "Toulouse": [43.6045, 1.4442],
            "Nice": [43.7102, 7.2620],
            "Nantes": [47.2184, -1.5536],
            "Strasbourg": [48.5734, 7.7521],
            "Montpellier": [43.6108, 3.8767],
            "Bordeaux": [44.8378, -0.5792],
            "Lille": [50.6292, 3.0573],
            "Rennes": [48.1173, -1.6778]
        };

        const searchInput = document.getElementById("citySearch");
        const searchButton = document.getElementById("searchButton");

        if (searchInput && searchButton) {
            searchButton.addEventListener("click", () => {
                const cityName = searchInput.value;
                if (cities[cityName]) {
                    const [lat, lon] = cities[cityName];
                    map.setView([lat, lon], 12);
                    updateLocation(lat, lon, `📍 ${cityName}`, "red");
                } else {
                    alert("Ville non trouvée. Essayez une grande ville de France !");
                }
            });
        }

        // Mise à jour du rayon du cercle avec le slider
        const distanceRange = document.getElementById("distanceRange");
        const distanceValue = document.getElementById("distanceValue");

        if (distanceRange) {
            distanceRange.addEventListener("input", () => {
                const newRadius = distanceRange.value * 1000;
                distanceValue.textContent = distanceRange.value;
                if (activeCircle) {
                    activeCircle.setRadius(newRadius);
                }
            });
        }
    } else {
        console.error("Carte non détectée !");
    }
});
