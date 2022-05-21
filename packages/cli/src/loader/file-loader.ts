import { parse, resolve } from 'path'
import { getAMPEntryUniq } from "../entry"
import parseAmpConf from '../parseAmpConf'
import { empty } from '../constants'
const { outputRoot } = parseAmpConf()

module.exports = function (source) {

  getAMPEntryUniq('loc').forEach(entry => {
    if (this.resourcePath.includes(entry.loc)) {
      const { ext } = parse(this.resourcePath)
      const output = entry.output.replace(resolve(outputRoot), empty) + ext
      this.emitFile(output, source)
    }
  })

  return ''
}
