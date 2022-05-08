import { Compiler } from 'webpack'
import { resolve, dirname } from 'path'
import fs from 'fs-extra'

interface Options {
  modules: string[]
}

class MpModuleWebpackPlugin {
  constructor(private options: Options) { }

  apply(compiler: Compiler) {
    const { output } = compiler.options

    compiler.hooks.done.tapAsync('MpModuleWebpackPlugin', (__, cb) => {

      if (!this.options?.modules?.length) return cb()

      const node_modules = resolve(output.path!, 'node_modules')

      fs.ensureDirSync(node_modules)

      this.options.modules.forEach(module => {
        fs.copySync(dirname(require.resolve(module)), resolve(node_modules, module), { dereference: true })
      })

      cb()
    })
  }
}

module.exports = MpModuleWebpackPlugin
