import { resolve } from 'path'
import { mergeWithCustomize, customizeObject } from 'webpack-merge'
import baseConf from './baseWebpackConf'
import getWebpackRules from './getWebpackRules'
import getWebpackPlugins from './getWebpackPlugins'
import parseAmpConf from '../parseAmpConf'
import parseCommand from '../parseCommand'

export default function createWebpackConf(): any {
  const { isProduct, isWatch } = parseCommand()
  const {
    outputRoot,
    webpack: userWebpack,
    entryIncludes,
    externals,
  } = parseAmpConf()

  const config = {
    entry: { app: entryIncludes },
    output: {
      path: resolve(outputRoot),
      publicPath: '/',
      filename: '[name].js',
    },
    resolve: {
      // https://webpack.js.org/configuration/resolve#resolveextensions
      extensions: ['.ts', '...'],
    },
    externals,
    mode: isProduct ? 'production' : 'none',
    optimization: {
      nodeEnv: isProduct ? 'production' : 'development',
    },
    devtool: isWatch ? 'inline-source-map' : 'source-map',
    plugins: getWebpackPlugins(),
    module: { rules: getWebpackRules() },
  }

  return userWebpack(
    mergeWithCustomize({
      customizeObject: customizeObject({
        snapshot: 'merge',
      }),
    })(baseConf, config)
  )
}
