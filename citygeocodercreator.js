function createCityGeocoder (execlib, mylib) {
  'use strict';

  var lib = execlib.lib,
    Geocoder = mylib.Geocoder;

  function CityGeocoder (apikey) {
    Geocoder.call(this, apikey, {google: 'json', needFields: null});
  }
  lib.inherit(CityGeocoder, Geocoder);
  CityGeocoder.prototype.formatForOutput = function (results) {
    return results.map(formatAddress);
  };

  function formatAddress (adr) {
    return lib.extend({formatted_address: adr.formatted_address}, lib.pick(adr.geometry, ['bounds', 'location', 'viewport']));
  }

  mylib.CityGeocoder = CityGeocoder;
}
module.exports = createCityGeocoder;
