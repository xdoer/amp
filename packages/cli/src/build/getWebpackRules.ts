import { resolve } from 'path'
import parseAmpConf from '../parseAmpConf'
import { platformConf } from '../ampConf'

export default function getWebpackRules() {
  const { alias, sourceRoot, platform } = parseAmpConf()
  const { xml, css, json } = platformConf[platform].ext

  return [
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
    {
      test: new RegExp(json),
      resourceQuery: /asConfig/,
      use: [require.resolve('@amp/cli/dist/loader/json-loader')],
      type: 'javascript/auto',
    },
    {
      test: new RegExp(xml),
      use: [
        require.resolve('@amp/cli/dist/loader/xml-loader')
      ],
    },
    {
      test: new RegExp(css),
      use: [require.resolve('@amp/cli/dist/loader/file-loader')],
    },
    {
      test: /\.less/,
      use: [
        {
          loader: require.resolve('@amp/cli/dist/loader/file-loader'),
          options: {
            ext: css
          },
        },
        require.resolve('less-loader')
      ],
    },
  ]
}