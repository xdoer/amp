import parseAmpConf from '../parseAmpConf'
import parseCommand from '../parseCommand'
import webpack from 'webpack'
import AmpWebpackPlugin from '../plugin/amp-plugin'

export default function getWebpackPlugins() {
  const { isProduct } = parseCommand()
  const { defineConstants } = parseAmpConf()

  return [
    new AmpWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isProduct ? '"production"' : '"development"',
      },
      ...defineConstants,
    }),
  ]
}
