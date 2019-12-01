"use strict";

var _require = require('@babel/helper-module-imports'),
    addDefault = _require.addDefault;

var resolveModule = require('./modules');

var _require2 = require('../config/constant'),
    packageName = _require2.packageName;

var SPECIAL_TYPES = ['isMemberExpression', 'isProperty'];

function isSpecialTypes(types, node) {
  return SPECIAL_TYPES.filter(function (type) {
    return types[type](node);
  }).length > 0;
}

module.exports = function (_ref) {
  var types = _ref.types;
  var authKit, removablePaths, specified, selectedMethods;

  function importMethod(useES, methodName, file) {
    if (!selectedMethods[methodName]) {
      var path = resolveModule(useES, methodName);
      selectedMethods[methodName] = addDefault(file.path, path, {
        nameHint: methodName
      });
    }

    return types.clone(selectedMethods[methodName]);
  }

  function matchesKits(path, name) {
    return authKit[name] && (hasBindingOfType(path.scope, name, 'ImportDefaultSpecifier') || hasBindingOfType(path.scope, name, 'ImportNamespaceSpecifier'));
  }

  function matchesKitsMethod(path, name) {
    return specified[name] && hasBindingOfType(path.scope, name, 'ImportSpecifier');
  }

  function hasBindingOfType(scope, name, type) {
    return scope.hasBinding(name) && scope.getBinding(name).path.type === type;
  }

  return {
    visitor: {
      Program: {
        enter: function enter() {
          authKit = Object.create(null);
          removablePaths = [];
          specified = Object.create(null);
          selectedMethods = Object.create(null);
        },
        exit: function exit() {
          removablePaths.filter(function (path) {
            return !path.removed;
          }).forEach(function (path) {
            return path.remove();
          });
        }
      },
      ImportDeclaration: function ImportDeclaration(path) {
        var node = path.node;

        if (node.source.value === packageName) {
          node.specifiers.forEach(function (spec) {
            if (types.isImportSpecifier(spec)) {
              specified[spec.local.name] = spec.imported.name;
              return;
            }

            authKit[spec.local.name] = true;
          });
          path.replaceWith(types.nullLiteral());
          removablePaths.push(path);
        }
      },
      ExportNamedDeclaration: function ExportNamedDeclaration(path, state) {
        var node = path.node,
            hub = path.hub;
        var useES = state.opts.useES;

        if (node.source && node.source.value === packageName) {
          var specifiers = node.specifiers.map(function (spec) {
            var importIdentifier = importMethod(useES, spec.exported.name, hub.file);
            var exportIdentifier = types.identifier(spec.local.name);
            return types.exportSpecifier(importIdentifier, exportIdentifier);
          });
          node.specifiers = specifiers;
          node.source = null;
        }
      },
      ExportAllDeclaration: function ExportAllDeclaration(path) {
        var node = path.node;

        if (node.source && node.source.value === packageName) {
          throw new Error('`export * from "authkit"` defeats the purpose of babel-plugin-authkit');
        }
      },
      CallExpression: function CallExpression(path, state) {
        var node = path.node,
            hub = path.hub;
        var name = node.callee.name;
        var useES = state.opts.useES;
        if (!types.isIdentifier(node.callee)) return;

        if (matchesKitsMethod(path, name)) {
          node.callee = importMethod(useES, specified[name], hub.file);
        }

        if (node.arguments) {
          node.arguments = node.arguments.map(function (arg) {
            var name = arg.name;
            return matchesKitsMethod(path, name) ? importMethod(useES, specified[name], hub.file) : arg;
          });
        }
      },
      MemberExpression: function MemberExpression(path, state) {
        var node = path.node;
        var objectName = node.object.name;
        var useES = state.opts.useES;
        if (!matchesKits(path, objectName)) return;
        var newNode = importMethod(useES, node.property.name, path.hub.file);
        path.replaceWith({
          type: newNode.type,
          name: newNode.name
        });
      },
      Property: function Property(path, state) {
        var node = path.node,
            hub = path.hub;
        var useES = state.opts.useES;

        if (types.isIdentifier(node.key) && node.computed && matchesKitsMethod(path, node.key.name)) {
          node.key = importMethod(useES, specified[node.key.name], hub.file);
        }

        if (types.isIdentifier(node.value) && matchesKitsMethod(path, node.value.name)) {
          node.value = importMethod(useES, specified[node.value.name], hub.file);
        }
      },
      Identifier: function Identifier(path, state) {
        var node = path.node,
            hub = path.hub,
            parent = path.parent;
        var name = node.name;
        var useES = state.opts.useES;

        if (matchesKitsMethod(path, name) && !isSpecialTypes(types, parent)) {
          var newNode = importMethod(useES, specified[name], hub.file);
          path.replaceWith({
            type: newNode.type,
            name: newNode.name
          });
        } else if (matchesKits(path, name)) {
          var replacementNode = types.nullLiteral();
          path.replaceWith(replacementNode);
        }
      }
    }
  };
};