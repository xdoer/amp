const path = require('path')

function resolve(...dirs) {
  return path.resolve(process.cwd(), ...dirs)
}

module.exports = {
  resolve,
}
