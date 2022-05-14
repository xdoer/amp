const fs = require('fs')
const { resolve } = require('./utils')

function isTsProject() {
  return fs.existsSync(resolve('tsconfig.json'))
}

module.exports = function getEntry(dir) {
  return resolve(dir, `app.${isTsProject() ? 'ts' : 'js'}`)
}
