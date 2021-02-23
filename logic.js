// Where are we getting the data?
var quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var platesUrl = "https://earthquake.usgs.gov/arcgis/rest/services/eq/map_plateboundaries/MapServer/1?f=pjson"

// Perform a GET request to the query URL
// Fetch the data from the API endpoint
d3.json(quakeUrl).then(data => {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data.features);
  
  // Zero in on the features property of your GEOJSON
  var earthquakeData = data['features'];
  console.log(earthquakeData);

  // earthquakeLayer = { 
     
    function getMagSize(mag) {
       switch (true) {
       case mag > 9:
         return 38;
       case mag > 8:
         return 34; 
       case mag > 7:
         return 30;
       case mag > 6:
         return 26;
       case mag > 5:
         return 22;
       case mag > 4:
         return 18;
       case mag > 3:
         return 14;
       case mag > 2:
         return 10;
       case mag > 1:
         return 6; 
       default:
         return 2;
       };
     };

    function getDepColor(dep) {
       switch (true) {
       case dep > 45:
         return "#061a00";
       case dep > 40:
         return "#134d00"; 
       case dep > 35:
         return "#208000";
       case dep > 30:
         return "#2db300";
       case dep > 25:
         return "#39e600";
       case dep > 20:
         return "#53ff1a";
       case dep > 15:
         return "#79ff4d";
       case dep > 10:
         return "#9fff80";
       case dep > 5:
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

    var earthquakes = L.geoJSON(earthquakeData, {
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

    /* 
    // PREVIOUSLY, I HAD SEPARATED THE D3 FUNCTION
    // BUT I NEEDED TO USE GEOJSON TO CREATE A LEGEND

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);

// End of d3 anonymous function
});
  
function createMap(earthquakes) {
  */
      
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
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map

  /////////////////////////////////////////////////////////
  // SELECTOR FOR CHOICE OF BASEMAPS (LIGHT & DARK) AND EARTHQUAKE DATA OVERLAY
  /////////////////////////////////////////////////////////
  L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);


  /////////////////////////////////////////////////////////
  //  COLOR LEGEND FOR EARTHQUAKE DEPTH
  /////////////////////////////////////////////////////////
  var legend = L.control.layers({position: 'topright'})  

  legend.onAdd = function (map) {
    
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45],    
    labels = [];
    
    var legendInfo = "<strong>Earthquake<br>Depth</strong><hr>"

    div.innerHTML = legendInfo;

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
      '<i style="background:' + getDepColor(grades[i] + 1) + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(myMap);


/////////////////////////////////////////////////////////
//  SIZE LEGEND FOR EARTHQUAKE MAGNITUDE
/////////////////////////////////////////////////////////
  var legend = L.control.layers({position: 'topright'})  

  legend.onAdd = function (map) {
    
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0,1,2,3,4,5,6,7,8,9],
    labels = ['<strong>Magnitude<br>(Richter)</strong><hr>'],
    categories = ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9','9+'];
    
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      var grade = grades[i];
      labels.push(
        '<i class="circlepadding" style="width: '
        +Math.max(8,(7-2.2*getMagSize(grade)))
        +'px;"></i> <i style="background: #d8eb34; width: '
        +getMagSize(grade)*2+'px; height: '
        +getMagSize(grade)*2+'px; border-radius: 50%; margin-top: '
        +Math.max(0,(9-getMagSize(grade)))
        +'px;"></i><i class="circlepadding" style="width: '
        +Math.max(2,(25-2*getMagSize(grade)))+'px;"></i> ' 
        + categories[i]+'<br>'
      );
      
    };

    div.innerHTML = labels.join('<br>');

    return div;

  };

  legend.addTo(myMap);

});
