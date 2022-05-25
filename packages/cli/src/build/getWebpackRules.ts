import parseAmpConf from '../parseAmpConf'
import { resolve } from 'path'

export default function getWebpackRules() {
  const { alias, sourceRoot } = parseAmpConf()

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
      test: /\.json/,
      resourceQuery: /asConfig/,
      use: [require.resolve('../../dist/loader/json-loader.js')],
      type: 'javascript/auto',
    },
    {
      test: /\.axml/,
      use: [
        require.resolve('../../dist/loader/xml-loader/index.js')
      ],
    },
    {
      test: /\.acss/,
      use: [require.resolve('../../dist/loader/file-loader.js')],
    },
    {
      test: /\.less/,
      use: [
        {
          loader: require.resolve('../../dist/loader/file-loader.js'),
          options: {
            ext: '.acss'
          },
        },
        require.resolve('less-loader')
      ],
    },
  ]
}