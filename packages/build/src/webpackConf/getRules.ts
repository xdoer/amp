import webpack from 'webpack'
import npmImportPlugin from 'less-plugin-npm-import'
import { resolve } from 'path'
import { parseAmpConf, platformConf } from '../ampConf'
import { fileLoader, jsonLoader, xmlLoader } from '../loader'

export default function getWebpackRules(): webpack.RuleSetRule[] {
  const { alias, sourceRoot, platform } = parseAmpConf()
  const { xml, css, json, njs } = platformConf[platform].ext

  const loader = {
    babelLoader: {
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
    postCssLoader: {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [['postcss-preset-env', {}]],
        },
      },
    },
  }

  return [
    {
      test: /\.js$/,
      use: [loader.babelLoader],
      include: [resolve(sourceRoot)],
    },
    {
      test: /\.ts$/,
      use: [loader.babelLoader, 'ts-loader'],
      include: [resolve(sourceRoot)],
    },
    {
      test: new RegExp(json),
      resourceQuery: /asConfig/,
      use: [jsonLoader],
      type: 'javascript/auto',
    },
    {
      test: new RegExp(xml),
      use: [xmlLoader],
    },
    {
      test: new RegExp(css),
      use: [fileLoader, loader.postCssLoader],
    },
    {
      test: /\.less/,
      use: [
        {
          loader: fileLoader,
          options: { ext: css },
        },
        loader.postCssLoader,
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              plugins: [new npmImportPlugin({ prefix: '~' })],
            },
          },
        },
      ],
    },
    {
      test: new RegExp(njs),
      use: [fileLoader, loader.babelLoader],
    },
    {
      test: /\.(png|jpe?g|gif|svg)$/,
      use: [fileLoader],
    },
  ]
}
