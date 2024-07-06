let map;
let drawnItems;
let drawControl;

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
            totalArea += L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        }
    });
    totalArea = totalArea / 1000000; // Convert to square kilometers
    document.querySelector('#total-area span').textContent = totalArea.toFixed(4);
    return totalArea;
}

function divideArea() {
    let totalArea = calculateArea();
    let numberOfSections = parseInt(document.getElementById('section-input').value) || 1;
    if (numberOfSections < 1) {
        alert("Please enter a valid number of sections (minimum 1)");
        return;
    }
    let areaPerSection = totalArea / numberOfSections;
    
    document.querySelector('#sections span').textContent = numberOfSections;
    document.querySelector('#area-per-section').textContent = `Area per section: ${areaPerSection.toFixed(4)} sq km`;
}

function updatePolygonList() {
    let list = document.getElementById('polygon-list');
    list.innerHTML = '';
    let index = 1;
    drawnItems.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
            let area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]) / 1000000;
            let li = document.createElement('li');
            li.textContent = `Polygon ${index}: ${area.toFixed(4)} sq km`;
            list.appendChild(li);
            index++;
        }
    });
}

function clearAll() {
    drawnItems.clearLayers();
    updatePolygonList();
    calculateArea();
    document.querySelector('#sections span').textContent = '0';
    document.querySelector('#area-per-section').textContent = '';
}

document.addEventListener('DOMContentLoaded', (event) => {
    initMap();
    document.getElementById('calculate-btn').addEventListener('click', calculateArea);
    document.getElementById('divide-btn').addEventListener('click', divideArea);
    document.getElementById('clear-btn').addEventListener('click', clearAll);

    document.getElementById('section-input').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value < 1) this.value = 1;
    });
});
