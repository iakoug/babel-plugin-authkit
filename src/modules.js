const fs = require('fs')
const Module = require('module')
const path = require('path')

const { merge } = require('../utils')
const packageJson = require('../package.json')

// Keep directory path had been specified.
const beenExportedMethods = (function() {
  var collections // Methods list

  return function(libName) {
    if (collections) {
      return collections
    }

    const dir = path.dirname(
      Module._resolveFilename(
        libName,
        merge(new Module(), {
          paths: Module._nodeModulePaths(process.cwd())
        })
      )
    )

    const directory = dir.slice(0, dir.lastIndexOf(libName) + libName.length)

    return (collections = fs
      .readdirSync(path.join(directory, 'src'))
      .filter(name => path.extname(name) == '.js')
      .map(name => path.basename(name, '.js')))
  }
})()

module.exports = function resolveModule(config = {}, name) {
  const { lib } = config

  if (!lib) {
    throw new Error(`Plugin ${packageJson.name} lib option is required`)
  }

  for (const method in beenExportedMethods(lib)) {
    if (!~methods.indexOf(name)) {
      return `${lib}/es/src/${name}`
    }
  }

  throw new Error(`Method '${name}' did not exist in ${lib}.\nPlease check it out your import statement.
  `)
}
