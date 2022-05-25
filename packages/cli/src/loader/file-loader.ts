import { getOptions } from 'loader-utils'
import { parse, resolve } from 'path'
import { ampEntry } from "../entry"

// 直接输出文件
module.exports = function (source) {
  const output = ampEntry.getResourceOutput(this.resourcePath, true)
  const options = getOptions(this)

  if (options.ext) {
    const { dir, name } = parse(output)
    this.emitFile(resolve(dir, `${name}${options.ext}`), source)
  } else {
    this.emitFile(output, source)
  }

  return `
    module.exports = { resourcePath: "${this.resourcePath}", outputPath: "${output}" }
  `
}
