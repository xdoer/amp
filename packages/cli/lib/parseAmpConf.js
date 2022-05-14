const { resolve } = require('./utils')

function getAmpConfig() {
  return require(resolve('amp.config.js'))
}

module.exports = function resolveAmpConfig() {
  return getAmpConfig()
}
