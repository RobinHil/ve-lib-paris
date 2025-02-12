# Ve-lib-Paris

Une application web interactive pour visualiser en temps réel la disponibilité des vélos en libre-service à Paris.

## Description

Ve-lib-Paris est une application web qui affiche une carte interactive des stations Vélib' de Paris. Elle permet de visualiser en temps réel :
- La localisation des stations
- Le nombre de vélos disponibles
- Le nombre de places de stationnement libres
- Les informations détaillées de chaque station

Les données sont actualisées toutes les 2.5 minutes pour garantir une information à jour.

## Fonctionnalités

- Carte interactive avec OpenStreetMap
- Marqueurs pour chaque station Vélib'
- Actualisation automatique des données (toutes les 2.5 minutes)
- Mode plein écran
- Popups au survol des stations

## Technologies utilisées

- JavaScript ES6+
- Leaflet.js pour la cartographie
- Webpack pour le bundling
- Sass pour les styles
- Babel pour la compatibilité navigateurs
- API OpenData Paris pour les données en temps réel

## Installation

1. Clonez le repository :
```bash
git clone https://github.com/RobinHil/ve-lib-paris.git
cd ve-lib-paris
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez le serveur de développement :
```bash
npm start
```

4. Pour construire la version de production :
```bash
npm run build
```

## Utilisation

L'application sera accessible à l'adresse `http://localhost:3000` après le lancement.

- Naviguez sur la carte avec la souris
- Survolez un marqueur pour voir les informations de la station
- Utilisez les contrôles de zoom (+/-) pour ajuster la vue
- Cliquez sur l'icône plein écran pour agrandir la carte

## Crédits

- Données : [OpenData Paris](https://opendata.paris.fr/)
- Cartographie : [OpenStreetMap](https://www.openstreetmap.org/)
