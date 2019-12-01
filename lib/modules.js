"use strict";

var packageJson = require('../package.json');

module.exports = function resolveModule() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var name = arguments.length > 1 ? arguments[1] : undefined;
  // TODO: Filter specific methods that doesn't exist
  var lib = config.lib;

  if (!lib) {
    throw new Error("Plugin ".concat(packageJson.name, " lib option is required"));
  }

  return "".concat(lib, "/es/src/").concat(name);
};