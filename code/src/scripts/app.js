import * as L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export class App
{
    constructor()
    {
        this.map = null
        this.markers = []

        this.addMap()
        this.addMarkers()
        setInterval(() => this.addMarkers(), 150000)
    }

    addMap()
    {
        if (!this.map)
        {
            this.map = L.map('map', {fullscreenControl: true}).setView([48.866667, 2.333333], 10)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map)
        }
    }

    addMarkers() 
    {
        fetch('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel/records?limit=-1')
        .then((response) => {
            if (!response.ok)
            {
                throw new Error(`Erreur HTTP! statut: ${response.status}`)
            }
            return response.json()
        })
        .then((data) => {
            data.results.forEach(station => {
                let exist = false
                const latitude = station.coordonnees_geo.lat
                const longitude = station.coordonnees_geo.lon
                this.markers.forEach(marker => {
                    if (marker.getLatLng().lat === latitude && marker.getLatLng().lng === longitude)
                    {
                        exist = true
                        marker.bindPopup(
                            'Station n°' + station.stationcode +
                            '<br><br>Nom: ' + station.name +
                            '<br>Ville: ' + station.nom_arrondissement_communes +
                            '<br><br>Disponibles:' +
                            '<br>&emsp&emsp- ' + station.numbikesavailable + ' vélo(s)' +
                            '<br>&emsp&emsp- ' + station.numdocksavailable + ' dock(s)'
                        )
                    }
                })
                if (!exist)
                {
                    const marker = L.marker([latitude, longitude]).addTo(this.map)
                        .bindPopup(
                            'Station n°' + station.stationcode +
                            '<br><br>Nom: ' + station.name +
                            '<br>Ville: ' + station.nom_arrondissement_communes +
                            '<br><br>Disponibles:' +
                            '<br>&emsp;&emsp;-' + station.numbikesavailable + ' vélo(s)' +
                            '<br>&emsp;&emsp;-' + station.numdocksavailable + ' dock(s)'
                        )
                        .on('mouseover', function (e)
                        {
                            this.openPopup()
                        })
                        .on('mouseout', function (e)
                        {
                            this.closePopup()
                        })
                    this.markers.push(marker)
                }
            })
        })
    }
}


// import * as L from 'leaflet'
// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// })
// import 'leaflet-fullscreen'

// var map
// var markers = []

// function addMap()
// {   
//     if(!map){
//         map = L.map('map', {fullscreenControl:true}).setView([48.866667, 2.333333], 10)
//         L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         maxZoom: 19,
//         attribution: '&copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         }).addTo(map)
//     }
// }

// function addMarkers()
// {
//     fetch('https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/velib-disponibilite-en-temps-reel/records?limit=-1')
//     .then((response) => {
//         if (!response.ok) {
//         throw new Error(`Erreur HTTP! statut: ${response.status}`)
//         }
//         return response.json()
//     })
//     .then((data) => {
//         var exist = new Boolean()
//         data.results.forEach(station => {
//             exist = false
//             var latitude = station.coordonnees_geo.lat
//             var longitude = station.coordonnees_geo.lon
//             markers.forEach(marker => {
//                 if (marker.getLatLng().lat===latitude && marker.getLatLng().lng===longitude)
//                 {
//                     exist = true
//                     marker.bindPopup(
//                         'Station n°' + station.stationcode +
//                         '<br><br>Nom: ' + station.name +
//                         '<br>Ville: ' + station.nom_arrondissement_communes +
//                         '<br><br>Disponibles:' + 
//                         '<br>&emsp&emsp- ' + station.numbikesavailable + ' vélo(s)' +
//                         '<br>&emsp&emsp- ' + station.numdocksavailable + ' dock(s)'
//                     )
//                 }
//             })
//             if (!exist)
//             {
//                 var marker = L.marker([latitude, longitude]).addTo(map)
//                     .bindPopup(
//                         'Station n°' + station.stationcode +
//                         '<br><br>Nom: ' + station.name +
//                         '<br>Ville: ' + station.nom_arrondissement_communes +
//                         '<br><br>Disponibles:' + 
//                         '<br>&emsp&emsp- ' + station.numbikesavailable + ' vélo(s)' +
//                         '<br>&emsp&emsp- ' + station.numdocksavailable + ' dock(s)'
//                     )
//                     .on('mouseover', function(e) {
//                         this.openPopup()
//                     })
//                     .on('mouseout', function(e) {
//                         this.closePopup()
//                     })
//                 markers.push(marker)
//             }
//         })
//     })
// }

// export function start()
// {
//     addMap()
//     addMarkers()
//     setInterval(addMarkers, 150000)
// }