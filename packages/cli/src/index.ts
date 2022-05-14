#!/usr/bin/env node

import parseCommand from "./parseCommand"
import createWebpackConf from "./createWebpackConf"
import chalk from 'chalk'
import webpack from 'webpack'

function main() {
  const { isWatch } = parseCommand()
  const webpackConf = createWebpackConf()

  const cb = (err, stats) => {
    if (err) {
      process.exitCode = 1
      return console.error(err)
    }

    const stStats = Array.isArray(stats!.stats) ? stats!.stats : [stats]

    stStats.forEach((item) => {
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

main()
