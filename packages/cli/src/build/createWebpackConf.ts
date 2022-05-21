import { mergeWithCustomize, customizeObject } from 'webpack-merge'
import parseAmpConf from '../parseAmpConf'
import parseCommand from '../parseCommand'
import baseConf from './webpackConf'
import getEntry from './getEntry'
import { resolve } from 'path'
import getWebpackRules from './getWebpackRules'
import getWebpackPlugins from './getWebpackPlugins'

export default function createWebpackConf(): any {
  const { isProduct, isWatch } = parseCommand()
  const { sourceRoot, outputRoot, webpack: userWebpack, extensions } = parseAmpConf()

  const config = {
    entry: { app: [getEntry(sourceRoot), getEntry(sourceRoot, 'json?asConfig')] },
    output: {
      path: resolve(outputRoot),
      publicPath: '/',
      filename: '[name].js',
    },
    resolve: {
      // https://webpack.js.org/configuration/resolve#resolveextensions
      extensions: [...extensions, '...'],
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
