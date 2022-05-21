import { resolve } from 'path'

export default {
  performance: {
    hints: false,
  },
  mode: 'none',
  resolve: {
    modules: ['node_modules'],
    alias: {
      // 小程序支持 async
      'regenerator-runtime': require.resolve('@amp/cli/dist/lib/regenerator-runtime'),
    },
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      // config: [resolve('config/')],
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
