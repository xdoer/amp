import { resolve } from 'path'
import webpack from 'webpack'
import { mergeWithCustomize, customizeObject } from 'webpack-merge'
import baseConf from './baseConf'
import getWebpackRules from './getRules'
import getWebpackPlugins from './getPlugins'
import { parseAmpConf } from '../ampConf'

export default function getWebpackConf(options): webpack.Configuration {
  const { isProduct, isWatch } = options

  const {
    outputRoot,
    webpack: userWebpack,
    entryIncludes,
    externals,
  } = parseAmpConf()

  const config: webpack.Configuration = {
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
    plugins: getWebpackPlugins(options),
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
