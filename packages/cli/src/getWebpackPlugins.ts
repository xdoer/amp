import parseAmpConf from './parseAmpConf'
import parseCommand from './parseCommand'
import webpack from 'webpack'

export default function getWebpackPlugins() {
  const { isProduct } = parseCommand()
  const { defineConstants } = parseAmpConf()

  return [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isProduct ? '"production"' : '"development"',
      },
      ...defineConstants,
    }),
  ]
}
