const { resolve } = require('path')
const { EnvironmentPlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MinaWebpackPlugin = require('./plugin/MinaWebpackPlugin')
const MinaRuntimePlugin = require('./plugin/MinaRuntimePlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const debuggable = process.env.BUILD_TYPE !== 'release'

module.exports = {
  context: resolve('src'),
  entry: './app.ts',
  output: {
    path: resolve('dist'),
    filename: '[name].js',
    globalObject: 'wx',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['babel-loader', 'ts-loader'],
      },
      {
        test: /\.less$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].wxss' }),
    new EnvironmentPlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'development',
      BUILD_TYPE: JSON.stringify(process.env.BUILD_TYPE) || 'debug',
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '**/*',
          to: './',
          globOptions: {
            ignore: ['**/*.ts', '**/*.less'],
          },
        },
      ],
    }),
    new MinaWebpackPlugin(),
    new MinaRuntimePlugin(),
  ],
  mode: debuggable ? 'none' : 'production',

  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'common',
      minChunks: 2,
      minSize: 0,
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },

  devtool: debuggable ? 'inline-source-map' : 'source-map',
}
