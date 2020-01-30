var apikey = require('./apikey.json');
var _forLatLngResolving = [{
  name: 'Brooklyn',
  lat: 40.714224,
  lng: -73.961452
},{
  name: 'Miami',
  lat: 25.734524,
  lng: -80.230481
},{
  name: 'Tršćanska 2',
  lat: 44.799123,
  lng: 20.491015
},{
  name: 'Milano',
  lat: 45.467469,
  lng: 9.211423
}];
/*
var _forLatLngResolving = [{
  name: 'Tršćanska 2',
  lat: 44.799123,
  lng: 20.491015
}];
*/

function doLatLng (lat, lng) {
  var p = Geocoder.doLatLng({
    latitude: lat,
    longitude: lng
  });
  return qlib.promise2console(p, 'lat '+lat+', lng '+lng+' => ');
}

var _forAddressResolving = [
  'Paris',
  'Paris T',
  'Paris TX',
  'Miami',
  'Zvezdara',
  'Tršćanska 2',
  'Tršćanska 2 Zemun',
  'Coconut Grove',
  'Dorcol',
  'Dorćol',
  'Dorcol B',
  'Dorcol Be',
  'Dorcol Bgd',
  'Dorcol Beograd',
  'Karaburma',
  'Viline Vode'
];

function doAddress (address) {
  var p = Geocoder.doAddress(address);
  return qlib.promise2console(p.then(addresser), 'address '+address+' => ');
}
function addresser (addr) {
  if (!(addr && addr[0].formatted_address && addr[0].geometry)) {
    return 'N/A';
  }
  return addr.map(formatAddress);
}
function formatAddress (adr) {
  return lib.extend({formatted_address: adr.formatted_address}, lib.pick(adr.geometry, ['bounds', 'location', 'viewport']));
  return lib.pick(adr, ['formatted_address', 'geometry']);
}

function doCityAddress (address) {
  var p = CityGeocoder.doAddress(address);
  return qlib.promise2console(p, 'address '+address+' => ');
}

describe ('Basic test', function () {
  it('Load Lib', function () {
    return setGlobal('Lib', require('..')(execlib));
  });
  it ('Create Geocoder', function () {
    return setGlobal('Geocoder', new Lib.Geocoder(apikey, {
      google: 'json',
      //want_fields: ['administrative_area_level_1']
    }));
  });
  /*
  _forLatLngResolving.forEach(rslv => {
    it('Reverse geocode '+rslv.name, function () {
      return doLatLng(rslv.lat, rslv.lng);
    });
  });
  */
  _forAddressResolving.forEach(rslv => {
    it('Reverse geocode '+rslv, function () {
      return doAddress(rslv);
    });
  });
  it ('Create CityGeocoder', function () {
    return setGlobal('CityGeocoder', new Lib.CityGeocoder(apikey));
  });
  _forAddressResolving.forEach(rslv => {
    it('Reverse geocode '+rslv, function () {
      return doCityAddress(rslv);
    });
  });
});
