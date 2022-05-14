// amp 配置文件
module.exports = {
  sourceRoot: 'src',
  outputRoot: 'dist',
  defineConstants: {},
  copy: {
    patterns: [{ from: 'sitemap.json', to: 'dist/sitemap.json' }],
    options: {},
  },
  alias: {
    '@components': path.resolve(__dirname, '..', 'src/components'),
  },
  webpack: {},
  webpackChain(config) {
    return config
  },
}
