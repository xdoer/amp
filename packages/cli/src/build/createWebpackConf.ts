import { mergeWithCustomize, customizeObject } from 'webpack-merge'
import parseAmpConf from '../parseAmpConf'
import parseCommand from '../parseCommand'
import baseConf from './baseWebpackConf'
import { resolve } from 'path'
import getWebpackRules from './getWebpackRules'
import getWebpackPlugins from './getWebpackPlugins'

export default function createWebpackConf(): any {
  const { isProduct, isWatch } = parseCommand()
  const { outputRoot, webpack: userWebpack, entryIncludes } = parseAmpConf()

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
