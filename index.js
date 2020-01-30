function createLib (execlib) {
  'use strict';
  var ret = {};
  require('./geocodercreator')(execlib, ret);
  require('./citygeocodercreator')(execlib, ret);
  return ret;
}
module.exports = createLib;
