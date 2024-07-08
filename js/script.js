let map;
let drawnItems;
let drawControl;

function initMap() {
    // Create the map and set the default view
    map = L.map('map').setView([0, 0], 2);

    // Define the tile layers
    var streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });

    var satelliteLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });

    // Use Stamen Watercolor tiles
    var tileLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg', {
        attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
    });

    // Add the street layer to the map
    streetLayer.addTo(map);

    // Add layer control to switch between street view and satellite view
    var baseMaps = {
        "Street View": streetLayer,
        "Satellite View": satelliteLayer,
        "Stamen Watercolor":tilelayer
    };

    L.control.layers(baseMaps).addTo(map);

    // Initialize the FeatureGroup to store drawn items
    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Add the drawing control
    drawControl = new L.Control.Draw({
        draw: {
            polygon: true,
            polyline: false,
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false
        },
        edit: {
            featureGroup: drawnItems,
            remove: true
        }
    });
    map.addControl(drawControl);

    // Event listeners for drawing and deleting polygons
    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;
        drawnItems.addLayer(layer);
        updatePolygonList();
        calculateArea();
    });

    map.on(L.Draw.Event.DELETED, function (event) {
        updatePolygonList();
        calculateArea();
    });
}

function updatePolygonList() {
    let list = document.getElementById('polygon-list');
    list.innerHTML = '';
    drawnItems.eachLayer(function(layer) {
        if (layer instanceof L.Polygon) {
            let li = document.createElement('li');
            li.textContent = 'Polygon: ' + layer._leaflet_id;
            list.appendChild(li);
        }
    });
}

function calculateArea() {
    let totalArea = 0;
    drawnItems.eachLayer(function(layer) {
        if (layer instanceof L.Polygon) {
            totalArea += L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        }
    });
    document.getElementById('total-area').querySelector('span').textContent = totalArea.toFixed(2);
}

function divideArea() {
    let sections = parseInt(document.getElementById('section-input').value);
    let totalArea = parseFloat(document.getElementById('total-area').querySelector('span').textContent);
    if (isNaN(sections) || sections <= 0) {
        alert('Please enter a valid number of sections.');
        return;
    }
    let areaPerSection = totalArea / sections;
    document.getElementById('sections').querySelector('span').textContent = sections;
    document.getElementById('area-per-section').textContent = 'Area per Section: ' + areaPerSection.toFixed(2) + ' sq meters';
}

document.getElementById('calculate-btn').addEventListener('click', calculateArea);
document.getElementById('divide-btn').addEventListener('click', divideArea);
document.getElementById('clear-btn').addEventListener('click', function() {
    drawnItems.clearLayers();
    updatePolygonList();
    calculateArea();
});

document.addEventListener('DOMContentLoaded', initMap);
