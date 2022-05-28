import { program } from 'commander'

const options = program
  .option('-w, --watch', 'watch mode')
  .option('-p, --production', 'production release')
  .option('-t, --target', 'build target')
  .option('--analyze', 'visualize size of webpack output files')
  .parse()
  .opts()

export default function parseCommand() {
  return {
    isProduct: options.production,
    isWatch: options.watch,
    target: options.target,
    analyze: options.analyze,
  }
}
