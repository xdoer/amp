import parseAmpConf from '../parseAmpConf'
import parseCommand from '../parseCommand'
import webpack from 'webpack'
import AmpPlugin from '../plugin/amp-entry'

export default function getWebpackPlugins() {
  const { isProduct } = parseCommand()
  const { defineConstants } = parseAmpConf()

  return [
    new AmpPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isProduct ? '"production"' : '"development"',
      },
      ...defineConstants,
    }),
  ]
}
