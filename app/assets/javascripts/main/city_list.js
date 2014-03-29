var cityList = function(config){
  this.config = config;
  this.init();
};

cityList.prototype.init = function(){
  this.listInput = $(this.config.elementSelector);
  options = {
    source: function( request, response ) {
      var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( request.term ), "i" );
      response( $.grep( window.travelConf, function( item ){
        return matcher.test( item );
      }));
    },
    delay: 0,
    minLength: 3
  };
  this.listInput.autocomplete(options);
};

cityList.prototype.selectedCity = function(){
  return this.listInput.val();
};
