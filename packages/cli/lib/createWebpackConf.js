const { mergeWithCustomize, customizeObject } = require('webpack-merge')
const Config = require('webpack-chain')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const parseAmpConf = require('./parseAmpConf')
const parseCommand = require('./parseCommand')
const baseConf = require('./webpackConf')
const getEntry = require('./getEntry')
const { resolve } = require('./utils')
const path = require('path')
const webpack = require('webpack')

module.exports = function createWebpackConf() {
  const { isProduct, isWatch } = parseCommand()
  const { sourceRoot, outputRoot, defineConstants, alias, copy } =
    parseAmpConf()

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
        'regenerator-runtime': path.resolve('./regenerator-runtime'),
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
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: resolve('project.config.json'),
            to: resolve(`${outputRoot}/project.config.json`),
          },
          ...copy,
        ],
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
                      root: sourceRoot,
                      alias,
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
                      root: sourceRoot,
                      alias,
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
    },
  }

  return webpackChain(
    new Config().merge(
      mergeWithCustomize({
        customizeObject: customizeObject({
          snapshot: 'replace',
        }),
      })(baseConf, config)
    )
  ).toConfig()
}
