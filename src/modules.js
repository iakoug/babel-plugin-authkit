const packageJson = require('../package.json')

module.exports = function resolveModule(config = {}, name) {
  // TODO: Filter specific methods that doesn't exist
  const { lib } = config

  if (!lib) {
    throw new Error(`Plugin ${packageJson.name} lib option is required`)
  }

  return `${lib}/es/src/${name}`
}
