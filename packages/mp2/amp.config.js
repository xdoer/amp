// amp 配置文件
module.exports = {
  sourceRoot: 'src',
  outputRoot: 'dist',
  defineConstants: {},
  alias: {},
  typeExtMap: {
    json: '.json',
    script: '.js',
    template: '.axml',
    styles: '.acss',
  },
  webpack(config) {
    return config
  },
}
