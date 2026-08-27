import * as L from 'leaflet'
import 'leaflet-fullscreen'
import 'leaflet.markercluster'

// Imports ESM plutot que require() : le module est charge en ESM, et require
// y renvoyait un objet module au lieu de l'URL de l'image.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
})

// L'endpoint /records plafonne silencieusement à 100 résultats (limit=-1 est ignoré).
// /exports/json renvoie les ~1500 stations en une seule requête, gzippée.
const STATIONS_URL = 'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel/exports/json'
const REFRESH_MS = 150000

// Les libellés viennent d'une API externe : on les échappe avant de les injecter
// dans le HTML de la popup.
function escapeHtml(value)
{
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

function popupHtml(station)
{
    return (
        'Station n°' + escapeHtml(station.stationcode) +
        '<br><br>Nom : ' + escapeHtml(station.name) +
        '<br>Ville : ' + escapeHtml(station.nom_arrondissement_communes) +
        '<br><br>Disponibles :' +
        '<br>&emsp;&emsp;- ' + escapeHtml(station.numbikesavailable) + ' vélo(s)' +
        '<br>&emsp;&emsp;- ' + escapeHtml(station.numdocksavailable) + ' dock(s)'
    )
}

export class App
{
    constructor()
    {
        this.map = null
        this.cluster = null
        // stationcode -> marker, pour retrouver un marqueur en O(1) au rafraîchissement
        this.markers = new Map()

        this.addMap()
        this.addMarkers()
        setInterval(() => this.addMarkers(), REFRESH_MS)
    }

    addMap()
    {
        if (this.map) return

        this.map = L.map('map', {fullscreenControl: true}).setView([48.866667, 2.333333], 12)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map)

        // ~1500 marqueurs : le clustering garde la carte fluide au dézoom.
        this.cluster = L.markerClusterGroup({showCoverageOnHover: false})
        this.map.addLayer(this.cluster)
    }

    showError(message)
    {
        let box = document.querySelector('#erreur')
        if (!box)
        {
            box = document.createElement('div')
            box.id = 'erreur'
            document.querySelector('#map').appendChild(box)
        }
        box.textContent = message
        box.hidden = false
    }

    clearError()
    {
        const box = document.querySelector('#erreur')
        if (box) box.hidden = true
    }

    async addMarkers()
    {
        let stations
        try
        {
            const response = await fetch(STATIONS_URL)
            if (!response.ok)
            {
                throw new Error(`statut HTTP ${response.status}`)
            }
            stations = await response.json()
            if (!Array.isArray(stations))
            {
                throw new Error('réponse inattendue')
            }
        }
        catch (error)
        {
            console.error('Récupération des stations impossible :', error)
            this.showError('Données Vélib’ indisponibles, nouvelle tentative dans 2 min 30.')
            return
        }

        const seen = new Set()

        for (const station of stations)
        {
            const coords = station.coordonnees_geo
            if (!coords || typeof coords.lat !== 'number' || typeof coords.lon !== 'number') continue

            const code = String(station.stationcode)
            seen.add(code)

            const existing = this.markers.get(code)
            if (existing)
            {
                existing.setPopupContent(popupHtml(station))
                continue
            }

            const marker = L.marker([coords.lat, coords.lon])
                .bindPopup(popupHtml(station))
                .on('mouseover', function () { this.openPopup() })
                .on('mouseout', function () { this.closePopup() })

            this.cluster.addLayer(marker)
            this.markers.set(code, marker)
        }

        // Stations retirées du jeu de données : on enlève leur marqueur.
        for (const [code, marker] of this.markers)
        {
            if (!seen.has(code))
            {
                this.cluster.removeLayer(marker)
                this.markers.delete(code)
            }
        }

        this.clearError()
        console.log(`${this.markers.size} stations affichées`)
    }
}
