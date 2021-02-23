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


  if (magnitude < 1) {
        markerSize = 2000;
      } else if (magnitude < 2) {
        markerSize = 6000;
      } else if (magnitude < 3) {
        markerSize = 10000;
      } else if (magnitude < 4) {
        markerSize = 14000;
      } else if (magnitude < 5) {
        markerSize = 18000;
      } else if (magnitude < 6) {
        markerSize = 22000;
      } else if (magnitude < 7) {
        markerSize = 26000;
      } else if (magnitude < 8) {
        markerSize = 30000;
      } else if (magnitude < 9) {
        markerSize = 34000;
      } else markerSize = 38000;