function createGeocoder (execlib, mylib) {
  'use strict';

  var lib = execlib.lib,
    q = lib.q;

  function Geocoder (apikey, format) {
    this.apikey = apikey;
    this.googleformat = format && format.google ? format.google : '';
    this.wantFields = format && format.want_fields ? format.want_fields : [];
    if (['json', 'xml'].indexOf(this.googleformat) < 0) {
      throw new lib.Error('GEOCODING_UNRECOGNIZED_GOOGLE_FORMAT', format+' must be "json" or "xml"');
    }
  }
  Geocoder.prototype.destroy = function () {
    this.wantFields = null;
    this.googleformat = null;
    this.apikey = null;
  };
  Geocoder.prototype.do = function (hash) {
    var d = q.defer(), ret = d.promise;
    hash = hash||{};
    hash.key=this.apikey;
    if (lib.isArray(this.wantFields)) {
      hash.result_type = this.wantFields.join('|');
    }
    lib.request('https://maps.googleapis.com/maps/api/geocode/'+this.googleformat, {
      method: 'GET',
      parameters:hash,
      onComplete: this._onDoComplete.bind(this, d),
      onError: console.error.bind(console, 'ooops')
    });
    d = null;
    return ret;
  };
  Geocoder.prototype.doLatLng = function (latlngobj) {
    return this.do({latlng: latlngobj.latitude+','+latlngobj.longitude});
  };
  Geocoder.prototype.doAddress = function (address) {
    return this.do({address: address});
  };
  Geocoder.prototype._onDoComplete = function (d, res) {
    var myres;
    if (!(res && res.data)) {
      d.reject(new lib.Error('GEOCODING_INVALID_RESPONSE', 'Google Geocoding API responded in an invalid fashion'));
      return;
    }
    if ('json' === this.googleformat) {
      myres = JSON.parse(res.data);
      if (!(myres && myres.status)) {
        console.log(myres);
        console.log('No status!');
        d.reject(new lib.Error('GEOCODING_RESPONSE_WITHOUT_STATUS', 'Google Geocoding API responded without a status'));
        return;
      }
      if (myres.status !== 'OK') {
        if (myres.status === 'ZERO_RESULTS') {
          myres.results = [];
        } else {
          d.reject(new lib.Error('GEOCODING_ERROR_'+myres.status, 'Google geocode error'));
          return;
        }
      }
      myres = myres.results;
      //console.log(require('util').inspect(myres, {depth:9, colors:true}));
    } else {
      myres = res.data;
    }
    d.resolve(this.formatForOutput(myres));
  };
  Geocoder.prototype.formatForOutput = function (results) {
    return results;
  };

  mylib.Geocoder = Geocoder;
}
module.exports = createGeocoder;
