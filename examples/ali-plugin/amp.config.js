const path = require('path')

// amp 配置文件
module.exports = {
  appEntry: path.resolve('plugin/plugin.json'),
  sourceRoot: 'plugin',
  outputRoot: 'dist',
  defineConstants: {},
  alias: {},
  style: '.less',
  entryIncludes: [
    path.resolve('plugin/index.js'),
    path.resolve('plugin/plugin.json?asConfig&type=app'),
  ],
  // 不打包某个依赖 https://webpack.js.org/configuration/externals/
  externals: {},
  webpack(config) {
    return config
  },
}
