import { resolve } from 'path'
import parseAmpConf from '../parseAmpConf'
import { platformConf } from '../ampConf'

export default function getWebpackRules() {
  const { alias, sourceRoot, platform } = parseAmpConf()
  const { xml, css, json, njs } = platformConf[platform].ext

  const babelLoader = {
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
  }

  return [
    {
      test: /\.js$/,
      use: [babelLoader],
      include: [resolve(sourceRoot)],
    },
    {
      test: /\.ts$/,
      use: [babelLoader, 'ts-loader'],
      include: [resolve(sourceRoot)],
    },
    {
      test: new RegExp(json),
      resourceQuery: /asConfig/,
      use: [require.resolve('@amp/cli/lib/loader/json-loader')],
      type: 'javascript/auto',
    },
    {
      test: new RegExp(xml),
      use: [require.resolve('@amp/cli/lib/loader/xml-loader')],
    },
    {
      test: new RegExp(css),
      use: [require.resolve('@amp/cli/lib/loader/file-loader')],
    },
    {
      test: new RegExp(njs),
      use: [require.resolve('@amp/cli/lib/loader/json-loader'), babelLoader],
    },
    {
      test: /\.less/,
      use: [
        {
          loader: require.resolve('@amp/cli/lib/loader/file-loader'),
          options: { ext: css },
        },
        require.resolve('less-loader'),
      ],
    },
    {
      test: /\.(png|jpe?g|gif|svg)$/,
      use: [require.resolve('@amp/cli/lib/loader/file-loader')],
    },
  ]
}
