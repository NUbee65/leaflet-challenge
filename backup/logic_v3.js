// Where are we getting the data?
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

// Perform a GET request to the query URL
// Fetch the data from the API endpoint
d3.json(queryUrl).then(data => {
    // Once we get a response, send the data.features object to the createFeatures function

    // Zero in on the features property of your GEOJSON
    var earthquakeData = data['features'];

    // Use L.geoJSON to create a geoJSON layer
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`
            <h3>Location: ${feature.properties.place}</h3>
            <hr>Date: ${new Date(feature.properties.time)}
            <br>Magnitude: ${feature.properties.mag}
            <br>Depth: ${feature.geometry.coordinates[2]}
            `);
        };
    });

    createMap(earthquakes);

});


function createMap(earthquakes) {

    // Define streetmap
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
        }).addTo(myMap);

    });

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
        37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakeLayer]
    });

});

