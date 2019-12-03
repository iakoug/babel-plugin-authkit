const fs = require('fs')
const Module = require('module')
const path = require('path')

const { merge } = require('../utils')
const packageJson = require('../package.json')
const extensions = `.js`
const esDirectory = `es/src`

// Keep directory path had been specified.
const beenExportedMethods = (function() {
  var collections // Methods list

  return function({ lib: libName, path: esPath }) {
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
      .readdirSync(path.join(directory, esPath || esDirectory))
      .filter(name => path.extname(name) === extensions)
      .map(name => path.basename(name, extensions)))
  }
})()

module.exports = function resolveModule(config = {}, name) {
  const { lib, path } = config

  if (!lib) {
    throw new Error(`Plugin ${packageJson.name} lib option is required.`)
  }

  const methods = beenExportedMethods(config)

  if (~methods.indexOf(name)) {
    return `${lib}/${path || esDirectory}/${name}`
  }

  throw new Error(
    `Method '${name}' did not exist in ${lib}/${path}.\nPlease check it out your import statement.`
  )
}
