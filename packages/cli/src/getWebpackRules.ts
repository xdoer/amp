import parseAmpConf from './parseAmpConf'
import { resolve } from './utils'

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
  ]
}