const { resolve } = require('path')

module.exports = {
  performance: {
    hints: false,
  },
  mode: 'none',
  resolve: {
    extensions: ['.js', '.ts'],
    modules: ['node_modules'],
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [resolve('config/')],
    },
    cacheDirectory: resolve('.cache/'),
  },
  snapshot: {
    managedPaths: [resolve('node_modules/')],
  },
  optimization: {
    emitOnErrors: true,
  },
}
