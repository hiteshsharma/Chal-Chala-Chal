var map = function(config){
  this.config = config;
  this.init();
};
map.prototype.init = function(){
  var that = this;
  var s = document.createElement('script');
  s.type = "text/javascript";
  s.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyCGDJFsq6GPA6dj-Hn7a422JpKAGARNZCw&sensor=false&libraries=weather&callback=google_maps_loaded";
  document.body.appendChild(s);
  window.google_maps_loaded = function(){
    that.mapsScriptLoaded = true;
    $(window).trigger("maps_script_loaded");
  };
};
map.prototype.load = function(){
  this.findLocation(function(result){
    var location = result.geometry.location;
    var mapOptions = {
      center: new google.maps.LatLng(location.lat(), location.lng()),
      zoom: 7
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    var weatherLayer = new google.maps.weather.WeatherLayer({
    temperatureUnits: google.maps.weather.TemperatureUnit.CELCIUS
  });
  weatherLayer.setMap(map);
  });
};

map.prototype.findLocation = function(callback){
  var that = this;
  if(!this.geocoder){
    this.geocoder = new google.maps.Geocoder();
  }
  this.geocoder.geocode({address: this.config.address}, function(result, status){
    if(status == "OK"){
      if(callback){
        callback.call(that, result[0]);
      }
    }
    console.log(status);
    return status;
  })
};
