const chalk = require('chalk')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const parseCommand = require('./parseCommand')
const createWebpackConf = require('./createWebpackConf')

function main() {
  const { isWatch } = parseCommand()
  const webpackConf = createWebpackConf()

  const compiler = webpack([webpackConf], (err, stats) => {
    if (err) {
      process.exitCode = 1
      return console.error(err)
    }

    const stStats = Array.isArray(stats.stats) ? stats.stats : [stats]

    stStats.forEach((item) => {
      console.log(item.compilation.name + '打包结果：')
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

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
    } else if (isWatch) {
      console.log(
        chalk.cyan(`  Build complete at ${new Date()}.\n  Still watching...\n`)
      )
    } else {
      console.log(chalk.cyan('  Build complete.\n'))
    }
  })

  if (isWatch) {
    const server = new WebpackDevServer(
      {
        ...webpackConf.devServer,
        open: true,
      },
      compiler
    )

    server.start()
  }
}

main()
