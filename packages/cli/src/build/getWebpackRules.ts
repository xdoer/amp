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
      use: [require.resolve('@amp/cli/dist/loader/json-loader')],
      type: 'javascript/auto',
    },
    {
      test: /\.axml/,
      use: [
        require.resolve('@amp/cli/dist/loader/xml-loader')
      ],
    },
    {
      test: /\.acss/,
      use: [require.resolve('@amp/cli/dist/loader/file-loader')],
    },
    {
      test: /\.less/,
      use: [
        {
          loader: require.resolve('@amp/cli/dist/loader/file-loader'),
          options: {
            ext: '.acss'
          },
        },
        require.resolve('less-loader')
      ],
    },
  ]
}