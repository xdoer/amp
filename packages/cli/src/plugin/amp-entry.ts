import { Compiler, EntryPlugin } from 'webpack'
import { resolve } from 'path'
import { Entry } from '../entry/types'
import getAMPEntry from '../entry'
import parseAmpConf from '../parseAmpConf'

export default class AMPEntry {
  apply(compiler: Compiler) {
    const { outputRoot } = parseAmpConf()
    const entries = getAMPEntry()

    const handle: Entry[] = []

    entries.forEach(entry => {
      if (handle.find(i => i.loc !== entry.loc)) {

        handle.push(entry)

        const { loc, output } = entry
        // https://webpack.js.org/plugins/internal-plugins/#entryplugin
        const out = output.replace(resolve(outputRoot), '')

        // js/ts entry
        new EntryPlugin(compiler.context, loc, out).apply(compiler)

        // json entry
        new EntryPlugin(compiler.context, loc + '.json?asConfig', out).apply(compiler)

        // axml entry
        new EntryPlugin(compiler.context, loc + '.axml', out).apply(compiler)
      }
    })
  }
}
