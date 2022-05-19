import { mergeWithCustomize, customizeObject } from 'webpack-merge'
import parseAmpConf from './parseAmpConf'
import parseCommand from './parseCommand'
import baseConf from './webpackConf'
import getEntry from './getEntry'
import { resolve } from './utils'
import getWebpackRules from './getWebpackRules'
import getWebpackPlugins from './getWebpackPlugins'

export default function createWebpackConf(): any {
  const { isProduct, isWatch } = parseCommand()
  const { sourceRoot, outputRoot, webpack: userWebpack } = parseAmpConf()

  const config = {
    entry: getEntry(sourceRoot),
    output: {
      path: resolve(outputRoot),
      publicPath: '/',
      filename: '[name].js',
    },
    mode: isProduct ? 'production' : 'none',
    optimization: {
      nodeEnv: isProduct ? 'production' : 'development',
    },
    devtool: isWatch ? 'inline-source-map' : 'source-map',
    plugins: getWebpackPlugins(),
    module: { rules: getWebpackRules() }
  }

  return userWebpack(
    mergeWithCustomize({
      customizeObject: customizeObject({
        snapshot: 'merge',
      }),
    })(baseConf, config)
  )
}
