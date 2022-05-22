import { parse, resolve } from 'path'
import { getAMPEntryUniq } from "../entry"
import parseAmpConf from '../parseAmpConf'
import { empty } from '../constants'
const { outputRoot } = parseAmpConf()

module.exports = function (source) {
  // this.cacheable()

  const entry = getAMPEntryUniq('loc').find(entry => this.resourcePath.includes(entry.loc))

  if (entry) {
    const { ext } = parse(this.resourcePath)
    const output = entry.output.replace(resolve(outputRoot), empty) + ext
    this.emitFile(output, source)
  }

  return ''
}
