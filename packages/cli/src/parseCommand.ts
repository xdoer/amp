import { program } from 'commander'

const options = program
  .option('-w, --watch', 'watch mode')
  .option('-p, --production', 'production release')
  .option('-t, --target', 'build target')
  .parse()
  .opts()

export default function parseCommand() {
  return {
    isProduct: options.production,
    isWatch: options.watch,
    target: options.target,
  }
}
