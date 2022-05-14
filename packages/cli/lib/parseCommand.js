const program = require('commander')

module.exports = function parseCommand() {
  program
    .option('-w, --watch', 'watch mode')
    .option('-p, --production', 'production release')
    .option('-t, --target', 'build target')
    .parse(process.argv)

  const isProduct = program.production
  const isWatch = program.watch
  const target = program.target

  return {
    isProduct,
    isWatch,
    target,
  }
}
