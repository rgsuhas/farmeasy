let map, drawnItems, drawControl;

function initMap() {
    map = L.map('map').setView([0, 0], 2);

    const baseLayers = {
        "Street View": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }),
        "Satellite View": L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            attribution: '© Google Maps',
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        })
    };

    baseLayers["Street View"].addTo(map);
    L.control.layers(baseLayers).addTo(map);

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
        const layer = event.layer;
        drawnItems.addLayer(layer);
        updatePolygonList();
        calculateArea();
    });

    map.on(L.Draw.Event.DELETED, function (event) {
        updatePolygonList();
        calculateArea();
    });
}

function calculateArea() {
    let totalArea = 0;
    drawnItems.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
            const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
            totalArea += area;
        }
    });
    document.getElementById('total-area').querySelector('span').textContent = (totalArea / 10000).toFixed(2);
}

function updatePolygonList() {
    const polygonList = document.getElementById('polygon-list');
    polygonList.innerHTML = '';
    drawnItems.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
            const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
            const listItem = document.createElement('li');
            listItem.textContent = `Polygon Area: ${(area / 10000).toFixed(2)} ha`;
            polygonList.appendChild(listItem);
        }
    });
}

document.getElementById('calculate-btn').addEventListener('click', calculateArea);

document.getElementById('clear-btn').addEventListener('click', function () {
    drawnItems.clearLayers();
    updatePolygonList();
    calculateArea();
});

initMap();
