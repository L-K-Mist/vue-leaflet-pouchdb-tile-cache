import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default (elementId) => {
  // 		var map = L.map('map').setView([63.41784,10.40359], 5);
  var map = L.map(elementId).setView([40, -100], 4);
  console.log("dvdb - map", map)

  var layer = L.tileLayer(
    "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png",
    {
      maxZoom: 18,
      attribution:
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: "examples.map-i875mjb7",
      useCache: true,
      crossOrigin: true,
    }
  );

  // Listen to cache hits and misses and spam the console
  // The cache hits and misses are only from this layer, not from the WMS layer.
  layer.on("tilecachehit", function (ev) {
    console.log("Cache hit: ", ev.url);
  });
  layer.on("tilecachemiss", function (ev) {
    console.log("Cache miss: ", ev.url);
  });
  layer.on("tilecacheerror", function (ev) {
    console.log("Cache error: ", ev.tile, ev.error);
  });

  layer.addTo(map);
  // NB Here's where we might be able to use cartoserver instead
  var wmsLayer = L.tileLayer.wms(
    "https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi",
    {
      layers: "nexrad-n0r-900913",
      format: "image/png",
      transparent: true,
      attribution: "Weather data © 2012 IEM Nexrad",

      useCache: true,
      cacheMaxAge: 30 * 1000, // 30 seconds
      crossOrigin: true,
    }
  );

  wmsLayer.addTo(map);

  wmsLayer.on("tilecachehit", function (ev) {
    console.log("Cache hit: ", ev.url);
  });
  wmsLayer.on("tilecachemiss", function (ev) {
    console.log("Cache miss: ", ev.url);
  });
  wmsLayer.on("tilecacheerror", function (ev) {
    console.log("Cache error: ", ev.tile, ev.error);
  });

  // Seed the base layer, for the whole world, for zoom levels 0 through 4.
  function seed() {
    var bbox = L.latLngBounds(L.latLng(-80, -180), L.latLng(85, 180));
    layer.seed(bbox, 0, 4);
  }

  // Display seed progress on console
  layer.on("seedprogress", function (seedData) {
    var percent =
      100 - Math.floor((seedData.remainingLength / seedData.queueLength) * 100);
    console.log("Seeding " + percent + "% done");
  });
  layer.on("seedend", function (seedData) {
    console.log("Cache seeding complete");
  });
  return L
}

