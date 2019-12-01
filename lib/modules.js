"use strict";

var fs = require('fs');

var Module = require('module');

var path = require('path');

var _require = require('../utils'),
    merge = _require.merge;

var packageJson = require('../package.json'); // Keep directory path had been specified.


var beenExportedMethods = function () {
  var collections; // Methods list

  return function (libName) {
    if (collections) {
      return collections;
    }

    var dir = path.dirname(Module._resolveFilename(libName, merge(new Module(), {
      paths: Module._nodeModulePaths(process.cwd())
    })));
    var directory = dir.slice(0, dir.lastIndexOf(libName) + libName.length);
    return collections = fs.readdirSync(path.join(directory, 'src')).filter(function (name) {
      return path.extname(name) == '.js';
    }).map(function (name) {
      return path.basename(name, '.js');
    });
  };
}();

module.exports = function resolveModule() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var name = arguments.length > 1 ? arguments[1] : undefined;
  var lib = config.lib;

  if (!lib) {
    throw new Error("Plugin ".concat(packageJson.name, " lib option is required"));
  }

  for (var method in beenExportedMethods(lib)) {
    if (!~methods.indexOf(name)) {
      return "".concat(lib, "/es/src/").concat(name);
    }
  }

  throw new Error("Method '".concat(name, "' did not exist in ").concat(lib, ".\nPlease check it out your import statement.\n  "));
};