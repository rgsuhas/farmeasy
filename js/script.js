let map, drawingManager;
let polygons = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon']
        }
    });
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
            polygons.push(event.overlay);
        }
    });

    document.getElementById('calculate').addEventListener('click', calculateArea);
    document.getElementById('divide').addEventListener('click', divideArea);
}

function calculateArea() {
    if (polygons.length === 0) {
        alert('Please draw a polygon first');
        return;
    }
    let totalArea = 0;
    polygons.forEach(polygon => {
        totalArea += google.maps.geometry.spherical.computeArea(polygon.getPath());
    });
    alert(`Total Area: ${totalArea.toFixed(2)} square meters`);
}

function divideArea() {
    // Implement area division logic here
    alert('Area division not implemented yet');
}

window.onload = initMap;
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });

  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ["polygon"],
    },
  });
  drawingManager.setMap(map);
}

// Call initMap when the page loads
google.maps.event.addDomListener(window, 'load', initMap);
