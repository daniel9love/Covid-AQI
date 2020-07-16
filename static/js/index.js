// Creating map object
var map = L.map("map", {
  center: [37.8, -95.5795],
  zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(map);


// Load in geojson data
var statesAQI = "../static/data/statesAQI.json";

// Format Date
function formatDate(nowDate) {
  nowDate = (nowDate.getMonth() + 1) +'/'+ (nowDate.getDate()+1) +"/"+ nowDate.getFullYear();
  if (nowDate === "12/32/1969") {
    nowDate = "None"
  }
  if (nowDate === "3/32/2020") {
    nowDate = "4/1/2020"
  } 
  
	return nowDate;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// Grab data with d3
d3.json(statesAQI, function(data) {
  // Create a new choropleth layer
  var geojson = L.choropleth(data, {

    // Define what property in the features to use
    valueProperty: "AQI",

    // Set color scale
    scale:["rgb(254,255,195)", "rgb(88,180,177)", "rgb(29,38,127)"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.City+", "+feature.properties.State + 
      "<br>Population: " + numberWithCommas(feature.properties.Population) + 
      "<br>Shelter in Place Ordinance: " + formatDate(new Date(feature.properties.ShelterinPlaceOrdinance))+
      "<br>Post Ordinance Average AQI: " + feature.properties.AQI);
    }
  }).addTo(map);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>AQI Averages</h1>" +
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
  legend.addTo(map);

});
