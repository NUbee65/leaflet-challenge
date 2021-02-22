layer = { 
  function getDepColor(mag) {
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
    }
  }

  function geojsonMarkerOptions  (feature) {
          return{
          radius: 8,
          fillColor: getDepColor(feature.properties.mag),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
}      
  };
  
  // See: https://leafletjs.com/reference-1.4.0.html#geojson-pointtolayer
  var pointToLayer = function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions(feature));
    }
  
  // See: https://leafletjs.com/examples/geojson/
  let layer = L.geoJSON(quakes.features, { pointToLayer: pointToLayer }).addTo(map);
  
  return layer;
}