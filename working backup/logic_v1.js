// Where are we getting the data?
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-07&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
// Fetch the data from the API endpoint
d3.json(queryUrl).then(data => {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);
  
  // Zero in on the features property of your GEOJSON
  var earthquakeData = data['features'];
  console.log(earthquakeData);

  /*
  var geojsonMarkerOptions = {
    radius: 1500,
    fillColor: "darkred",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8};
  */

 

  // Use L.geoJSON to create a geoJSON layer
  var earthquakeLayer = L.geoJson(earthquakeData, {

    // We turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {

      // marker size function returns based on magnitude
      function getMagSize(x) {
        return x > 9 ? 38000 :
         x > 8 ? 34000 :
         x > 7 ? 30000 :
         x > 6 ? 26000 :
         x > 5 ? 22000 :
         x > 4 ? 18000 :
         x > 3 ? 14000 :
         x > 2 ? 10000 :
         x > 1 ? 6000 :
         2000;
      };

      // marker color function returns based on depth
      function getDepColor(x) {
        return y > 45 ? "#061a00" :
         y > 40 ? "#134d00" :
         y > 35 ? "#208000" :
         y > 30 ? "#2db300" :
         y > 25 ? "#39e600" :
         y > 20 ? "#53ff1a" :
         y > 15 ? "#79ff4d" :
         y > 10 ? "#9fff80" :
         y > 5 ? "#c6ffb3" :
         "#ecffe6";
      };
      
      // style function 
      function style(feature) {
        return {
          "radius": getMagSize(feature.properties.mag),
          "colorFill": getDepColor(feature.geometry.coordinates[2])
        };
      };

      return L.circleMarker(latlng, style);      

    },

    // We set the style for each circleMarker using our styleInfo function.
    //style: styleInfo,
    // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`
        <h3>Location: ${feature.properties.place}</h3>
        <hr>Date: ${new Date(feature.properties.time)}
        <br>Magnitude: ${feature.properties.mag}
        <br>Depth: ${feature.geometry.coordinates[2]}        
      `);
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

});