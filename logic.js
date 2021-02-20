// We create the tile layer that will be the background of our map.
console.log("Step 1 working");
// Set start and end dates
var startDate = '2021-02-11';
var endDate = '2021-02-18';

// Store our API endpoint inside queryUrl
// Where are we getting the data?
//var queryUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337`;
var queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
// Perform a GET request to the query URL
// Fetch the data from the API endpoint
d3.json(queryUrl), (data) => {  
  console.log(data.features);
  // Once we get a response, send the data.features object to the createFeatures function
  // Zero in on the features property of your GEOJSON
  earthquakeData = data['features'];
  
  var magnitude = feature.properties.mag; 
  console.log(magnitude);
  var depth = feature.geometry.coordinates[2];
  console.log(depth);
  
  ////////////////////////////////////////////////////////////////////////
  
  // earthquake magnitude correlates to marker size
  // the greater the earthquake magnitude, the larger the marker size
  
  var markerSize = 2000;         // this assumes meters (e.g., 2000 = 2km)
  
  if (magnitude >= 2) {
    markerSize = 6000;
  } else if (magnitude >= 3) {
    markerSize = 10000;
  } else if (magnitude >= 4) {
    markerSize = 14000;
  } else if (magnitude >= 5) {
    markerSize = 18000;
  } else if (magnitude >= 6) {
    markerSize = 22000;
  } else if (magnitude >= 7) {
    markerSize = 26000;
  } else if (magnitude >= 8) {
    markerSize = 30000;
  } else if (magnitude >= 9) {
    markerSize = 34000;
  }
  
////////////////////////////////////////////////////////////////////////

// earthquake depth correlates to color brightness
// the deeper the earthquake, the darker the color

var markerColor = "#ecffe6";

if (depth >= 5) {
  markerColor = "#c6ffb3";
} else if (depth >= 10) {
  markerColor = "#9fff80";
} else if (depth >= 15) {
  markerColor = "#79ff4d";
} else if (depth >= 20) {
  markerColor = "#53ff1a";
} else if (depth >= 25) {
  markerColor = "#39e600";
} else if (depth >= 30) {
  markerColor = "#2db300";
} else if (depth >= 35) {
  markerColor = "#208000";
} else if (depth >= 40) {
  markerColor = "#134d00";
} else if (depth >= 45) {
  markerColor = "#061a00";
}

var geojsonMarkerOptions = {
    radius: markerSize,
    fillColor: markerColor,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8}
    
  // Use L.geoJSON to create a geoJSON layer
  var earthquake = L.geoJSON(earthquakeData, {
    }, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
        },
      onEachFeature: function (feature, layer) {
          layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>${new Date(feature.properties.time)}`);
        }
    });
    
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
    
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
    
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
    
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakeLayer
    };
    
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakeLayer]
    });
    
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    