import { getOptions } from 'loader-utils'
import { parse, resolve } from 'path'
import { getAMPEntryUniq } from "../entry"
import parseAmpConf from '../parseAmpConf'
import { empty } from '../constants'
const { outputRoot, sourceRoot } = parseAmpConf()

// 直接输出文件
module.exports = function (source) {
  const entry = getAMPEntryUniq('loc').find(entry => this.resourcePath.includes(entry.loc))
  const options = getOptions(this)
  const ext = options.ext || parse(this.resourcePath).ext

  if (entry) {
    const output = entry.output.replace(resolve(outputRoot), empty) + ext
    this.emitFile(output, source)
  } else {
    // 输出的对应位置
    const _output = this.resourcePath.replace(resolve(sourceRoot), empty)
    const { dir, name } = parse(_output)
    const output = resolve(dir, `${name}${ext}`)
    this.emitFile(output, source)
  }

  return ''
}
