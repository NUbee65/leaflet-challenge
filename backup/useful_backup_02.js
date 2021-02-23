  // SIZE LEGEND FOR EARTHQUAKE MAGNITUDE

  var legend = L.control.layers({position: 'topright'})
  console.log("--- immediately prior to testing legend anonymous function ---")

  legend.onAdd = function(map) {
    console.log("--- testing legend anonymous function ---")

    var div = L.DomUtil.create('div', 'info legend');
    grades = [38,26,14,2],
    labels = [],
    categories = ['9+','6-7','3-4','0-1'];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=

      '<i class ="circle" style="border-radius: 100%; width:' 
      + getRadius(grades[i] + 1) +'px; height:' 
      + getRadius(grades[i] + 1) +'px; background:' 
      + grades[i] 
      + (grades[i + 1] ? '&ndash;' 
      + grades[i + 1] + '<br>' : '+');
    } 
  
    return div;
  };

  legend.addTo(myMap);










    /*
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Median Income</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
*/
