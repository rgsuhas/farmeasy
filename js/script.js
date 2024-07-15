let map, drawControl, drawnItems;
let sprinklerMap;

document.addEventListener('DOMContentLoaded', function () {
    initMap();
    document.getElementById('calculate-btn').addEventListener('click', calculateArea);
    document.getElementById('divide-btn').addEventListener('click', divideArea);
    document.getElementById('clear-btn').addEventListener('click', clearAll);
    document.getElementById('arrange-sprinklers-btn').addEventListener('click', arrangeSprinklers);
});

function initMap() {
    map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

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

    map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;
        drawnItems.addLayer(layer);
        updatePolygonList();
        calculateArea();
        displayPolygonInstance(layer);
    });

    map.on(L.Draw.Event.DELETED, function (event) {
        updatePolygonList();
        calculateArea();
    });

    // Initialize the second map for sprinkler visualization
    sprinklerMap = L.map('sprinkler-map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(sprinklerMap);
}

function calculateArea() {
    let totalArea = 0;
    drawnItems.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
            totalArea += L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        }
    });
    document.getElementById('total-area').querySelector('span').innerText = (totalArea / 10000).toFixed(2); // Convert to sq meters
}

function divideArea() {
    let sections = parseInt(document.getElementById('section-input').value);
    if (isNaN(sections) || sections < 1) {
        alert('Please enter a valid number of sections.');
        return;
    }
    // Logic to divide the area into sections
}

function clearAll() {
    drawnItems.clearLayers();
    document.getElementById('polygon-list').innerHTML = '';
    document.getElementById('total-area').querySelector('span').innerText = '0';
    document.getElementById('sections').querySelector('span').innerText = '0';
    document.getElementById('area-per-section').innerText = '';
}

function updatePolygonList() {
    const list = document.getElementById('polygon-list');
    list.innerHTML = '';
    drawnItems.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
            const li = document.createElement('li');
            li.innerText = `Polygon with ${layer.getLatLngs()[0].length} vertices`;
            list.appendChild(li);
        }
    });
}

function displayPolygonInstance(layer) {
    // Display the polygon instance below the map for further processing
    const cloneLayer = L.polygon(layer.getLatLngs(), { color: 'blue' }).addTo(sprinklerMap);
    sprinklerMap.fitBounds(cloneLayer.getBounds());
}

function arrangeSprinklers() {
    let sprinklers = parseInt(document.getElementById('sprinkler-input').value);
    if (isNaN(sprinklers) || sprinklers < 1) {
        alert('Please enter a valid number of sprinklers.');
        return;
    }

    let totalArea = parseFloat(document.getElementById('total-area').querySelector('span').innerText);
    if (totalArea === 0) {
        alert('Please draw an area on the map first.');
        return;
    }

    const sprinklerRadius = 20 * 0.3048; // Convert feet to meters
    const sprinklerArea = Math.PI * Math.pow(sprinklerRadius, 2); // Area covered by one sprinkler in sq meters
    const sprinklersPerSet = 10; // Sprinklers powered by borewell at a time
    const setsNeeded = Math.ceil(totalArea / (sprinklersPerSet * sprinklerArea));

    document.getElementById('sections').querySelector('span').innerText = setsNeeded;
    document.getElementById('area-per-section').innerText = `Area per section: ${(totalArea / setsNeeded).toFixed(2)} sq meters`;

    // Visualize the sprinklers arrangement
    drawnItems.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
            arrangeSprinklersInPolygon(layer, sprinklersPerSet);
        }
    });
}

function arrangeSprinklersInPolygon(polygon, sprinklersPerSet) {
    const latlngs = polygon.getLatLngs()[0];
    const bounds = polygon.getBounds();
    const center = bounds.getCenter();
    const sprinklerRadius = 20 * 0.3048; // Convert feet to meters

    for (let i = 0; i < sprinklersPerSet; i++) {
        const angle = (2 * Math.PI * i) / sprinklersPerSet;
        const offsetX = sprinklerRadius * Math.cos(angle);
        const offsetY = sprinklerRadius * Math.sin(angle);
        const sprinklerLatLng = L.latLng(center.lat + offsetY / 111000, center.lng + offsetX / (111000 * Math.cos(center.lat * (Math.PI / 180))));
        L.circle(sprinklerLatLng, { radius: sprinklerRadius, color: 'green' }).addTo(sprinklerMap);
    }
}
