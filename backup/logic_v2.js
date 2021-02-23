// Where are we getting the data?
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-06&endtime=2021-01-07&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
// Fetch the data from the API endpoint
d3.json(queryUrl).then(data => {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);
  
  // Zero in on the features property of your GEOJSON
  var earthquakeData = data['features'];
  console.log(earthquakeData);

  // earthquakeLayer = { 
     
    function getMagSize(mag) {
       switch (true) {
       case mag > 9:
         return 38000;
       case mag > 8:
         return 34000; 
       case mag > 7:
         return 30000;
       case mag > 6:
         return 26000;
       case mag > 5:
         return 22000;
       case mag > 4:
         return 18000;
       case mag > 3:
         return 14000;
       case mag > 2:
         return 10000;
       case mag > 1:
         return 6000; 
       default:
         return 2000;
       };
     };

    function getDepColor(dep) {
       switch (true) {
       case dep > 9:
         return "#061a00";
       case dep > 8:
         return "#134d00"; 
       case dep > 7:
         return "#208000";
       case dep > 6:
         return "#2db300";
       case dep > 5:
         return "#39e600";
       case dep > 4:
         return "#53ff1a";
       case dep > 3:
         return "#79ff4d";
       case dep > 2:
         return "#9fff80";
       case dep > 1:
         return "#c6ffb3"; 
       default:
         return "#ecffe6";
       };
     };

    function geojsonMarkerOptions(feature) {
      return {    
        radius: getMagSize(feature.properties.mag),
        fillColor: getDepColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
    };

    var pointToLayer = function (feature, latlng) {
      // We turn each feature into a circleMarker on the map.
      return L.circleMarker(latlng, geojsonMarkerOptions(feature));     
    };

    let earthquakeLayer = L.geoJSON(earthquakeData, {
      pointToLayer: pointToLayer,
      onEachFeature: function (feature, layer) {
        layer.bindPopup(`
        <h3>Location: ${feature.properties.place}</h3>
        <hr>Date: ${new Date(feature.properties.time)}
        <br>Magnitude: ${feature.properties.mag}
        <br>Depth: ${feature.geometry.coordinates[2]}        
        `)
      }
    });


  // };
  
    
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

});