const { packageName } = require('../config/constant')

module.exports = function resolveModule(config, name) {
  // TODO: Filter specific methods that doesn't exist

  return `${packageName}/es/src/${name}`
}
