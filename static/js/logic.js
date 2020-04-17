var earthquake_data = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(earthquake_data, function(data) {
  createFeatures(data.features);
});
function percent2color(percent) {
    var b = 100;
    var g = 100;
    var r = Math.round(5.1 * percent);
    
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
}


function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + "Location: " + feature.properties.place + "<h3>" + "Magnitude: " +  feature.properties.mag)
    } 
  
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        
        var Marker = {
          radius: 8*feature.properties.mag,
          fillColor: percent2color(Math.round(feature.properties.mag * 10)),
          color: "white",
          weight: 1.5,
          fillOpacity: 0.6,
          opacity: 1,
        };
        return L.circleMarker(latlng, Marker);
      }
    });
  
    createMap(earthquakes);
    
  }
  
  function createMap(earthquakes) {
  
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoiYW1vdWxkIiwiYSI6ImNrNzd3eng0NTBjaHYzZnA2bXh6d2NmZjUifQ.zFtUB1PvEsf0AzEeeEcbhg");
   
    var baseMaps = {
      "Light Map": lightmap
    };
  
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    var myMap = L.map("map", {
      center: [
        40, -100
      ],
      zoom: 5,
      layers: [lightmap, earthquakes]
    });
  
    function getColor(d) {
      return d > 5 ? 'rgb(255, 51, 51)' :
             d > 4  ? 'rgb(255, 102, 51)' :
             d > 3  ? 'rgb(255, 153, 51)' :
             d > 2  ? 'rgb(255, 204, 51)' :
             d > 1  ? 'rgb(255, 255, 51)' :
                      'rgb(255, 255, 51)';
    }
  
    var legend = L.control({position: 'topright'});
  
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
        mag = [0, 1, 2, 3, 4, 5],
        labels = [];
  
        div.innerHTML+='Magnitude<br><hr>'
    
        for (var i = 0; i < mag.length; i++) {
            div.innerHTML +=
                '<i style="background:' + percent2color(mag[i] *10) + '">&nbsp      </i> ' +
                mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
    }
    
    return div;
    };
    
    legend.addTo(myMap);
  
  }