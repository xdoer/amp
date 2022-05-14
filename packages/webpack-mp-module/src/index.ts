import { Compiler } from 'webpack'
import { resolve, dirname } from 'path'
import fs from 'fs-extra'

interface ModelConfig extends fs.CopyOptions {
  name: string
}

interface Options {
  modules: ModelConfig[]
}

class MpModuleWebpackPlugin {
  constructor(private options: Options) { }

  apply(compiler: Compiler) {
    const { output } = compiler.options

    compiler.hooks.done.tapAsync('MpModuleWebpackPlugin', async (__, cb) => {

      if (!this.options?.modules?.length) return cb()

      const node_modules = resolve(output.path!, 'node_modules')

      await fs.ensureDir(node_modules)

      await Promise.all(
        this.options.modules.map(module => {
          const { name, ...config } = module
          fs.copy(dirname(require.resolve(name)), resolve(node_modules, name), config)
        })
      )

      cb()
    })
  }
}

module.exports = MpModuleWebpackPlugin
