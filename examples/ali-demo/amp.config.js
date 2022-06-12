const path = require('path')

// amp 配置文件
module.exports = {
  appEntry: path.resolve('src/app.json'),
  sourceRoot: 'src',
  outputRoot: 'dist',
  defineConstants: {},
  alias: {},
  // style: '.acss',
  entryIncludes: [
    path.resolve('src/app.js'),
    path.resolve('src/app.acss'),
    path.resolve('src/app.json?asConfig&type=app'),
  ],
  // 不打包某个依赖 https://webpack.js.org/configuration/externals/
  externals: {},
  webpack(config) {
    return config
  },
}
