"use strict";

var _require = require('../config/constant'),
    packageName = _require.packageName;

module.exports = function resolveModule(config, name) {
  // TODO: Filter specific methods that doesn't exist
  return "".concat(packageName, "/es/src/").concat(name);
};