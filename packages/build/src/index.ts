import chalk from 'chalk'
import webpack from 'webpack'
import { BuildOptions } from './types'
import getWebpackConf from './webpackConf'

export default function (options: BuildOptions) {
  const { isWatch } = options
  const webpackConf = getWebpackConf(options)

  const cb = (err, stats) => {
    if (err) {
      process.exitCode = 1
      return console.error(err)
    }

    const states = Array.isArray(stats!.stats) ? stats!.stats : [stats]

    states.forEach((item) => {
      console.log((item.compilation.name || '') + '打包结果：')
      process.stdout.write(
        item.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false,
          entrypoints: false,
        }) + '\n\n'
      )
    })

    if (stats!.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
    } else if (isWatch) {
      console.log(
        chalk.cyan(`  Build complete at ${new Date()}.\n  Still watching...\n`)
      )
    } else {
      console.log(chalk.cyan('  Build complete.\n'))
    }
  }

  if (isWatch) {
    webpack([webpackConf]).watch([], cb)
  } else {
    webpack([webpackConf], cb)
  }
}
