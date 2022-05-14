import { mergeWithCustomize, customizeObject } from 'webpack-merge'
import parseAmpConf from './parseAmpConf'
import parseCommand from './parseCommand'
import baseConf from './webpackConf'
import getEntry from './getEntry'
import { resolve } from './utils'
import webpack from 'webpack'

export default function createWebpackConf(): any {
  const { isProduct, isWatch } = parseCommand()
  const { sourceRoot, outputRoot, defineConstants, alias, webpack: userWebpack } = parseAmpConf()

  const config = {
    entry: {
      app: getEntry(sourceRoot),
    },
    output: {
      path: resolve(outputRoot),
      publicPath: '/',
      filename: '[name].js',
    },
    resolve: {
      alias: {
        'regenerator-runtime': require.resolve('@amp/cli/dist/lib/regenerator-runtime'),
      },
    },
    mode: isProduct ? 'production' : 'none',
    optimization: {
      nodeEnv: isProduct ? 'production' : 'development',
    },
    devtool: isWatch ? 'inline-source-map' : 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: isProduct ? '"production"' : '"development"',
        },
        ...defineConstants,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                plugins: [
                  [
                    'module-resolver',
                    {
                      root: './src',
                      alias: {
                        '@': './src',
                        ...alias,
                      },
                    },
                  ],
                ],
              },
            },
          ],
          include: [resolve(sourceRoot)],
        },
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                plugins: [
                  [
                    'module-resolver',
                    {
                      root: './src',
                      alias: {
                        '@': './src',
                        ...alias
                      },
                    },
                  ],
                ],
              },
            },
            'ts-loader',
          ],
          include: [resolve(sourceRoot)],
        },
      ],
    }
  }

  return userWebpack(
    mergeWithCustomize({
      customizeObject: customizeObject({
        snapshot: 'merge',
      }),
    })(baseConf, config)
  )
}
