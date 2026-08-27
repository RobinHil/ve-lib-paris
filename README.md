# Ve-lib-Paris

An interactive map of every Vélib' station in Paris, showing live bike and dock
availability from the [Paris open data](https://opendata.paris.fr/) platform.

## Features

- All ~1500 stations on an OpenStreetMap base layer, grouped into clusters that
  expand as you zoom in.
- Hovering a marker opens a popup with the station number, name, city, and the
  number of bikes and docks currently available.
- Data refreshes automatically every 2 minutes 30, in place: markers are updated
  rather than rebuilt, and stations that leave the dataset are removed.
- Full-screen control, and a visible message if the open data API is
  unreachable.

## Stack

- JavaScript (ES6+), SCSS
- Leaflet, with the `leaflet-fullscreen` and `leaflet.markercluster` plugins
- Webpack 5, Babel 8, PostCSS, Sass
- Paris open data API (`velib-disponibilite-en-temps-reel`)

## Running it

Requires Node.js 24 (the current LTS); see `code/.nvmrc`. All the source
lives in `code/`.

```bash
cd code
npm install
npm start          # development server on http://localhost:3000
npm run build      # production build in dist/
```

`dist/` is a plain static bundle: copy it to any web server, no runtime needed.

## Using the map

- Drag to pan, scroll or pinch to zoom, or use the `+` / `-` controls.
- Click a cluster to zoom into the stations it contains.
- Hover a marker to see that station's availability.
- Use the control in the top-left corner to go full screen.

## Layout

```
code/
  src/
    scripts/      app.js (map, markers, refresh loop), img.js
    stylesheets/  styles.scss
    template.html
  webpack.common.js / webpack.dev.js / webpack.prod.js
```

## Credits

Data from [Paris open data](https://opendata.paris.fr/), map tiles from
[OpenStreetMap](https://www.openstreetmap.org/).
