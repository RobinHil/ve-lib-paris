import {App} from './scripts/app.js'
import './scripts/img.js'
import './stylesheets/styles.scss'

function start()
{
    // L'annee du copyright est calculee au chargement plutot que figee dans le
    // gabarit : une annee en dur devient fausse le 1er janvier suivant.
    const annee = document.getElementById('annee')
    if (annee) annee.textContent = new Date().getFullYear()

    let app = new App()
}

window.addEventListener('load', start)