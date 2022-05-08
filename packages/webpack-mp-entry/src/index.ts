import path from 'path'
import fs from 'fs'
import { EntryPlugin, Compiler } from 'webpack'
const replaceExt = require('replace-ext')

class MpEntryWebpackPlugin {
  entries: string[] = []

  basePath = path.resolve(process.cwd(), 'src')

  createEntries(entry: string, type = 'app') {
    const configFile = replaceExt(entry, '.json')
    const content = fs.readFileSync(configFile, 'utf8')
    const config = JSON.parse(content)

    // ts file
    switch (type) {
      // @ts-ignore
      case 'plugin':
        this.createEntries(entry, 'component')
      case 'app': {
        config.pages.forEach((page: string) => {
          const pagePath = path.resolve(this.basePath, page) + '.ts'
          this.entries.push(pagePath)
          this.createEntries(pagePath, 'page')
        })
        break
      }
      case 'component':
      case 'page': {
        const components = config.usingComponents || config.publicComponents
        Object.values(components || {}).map((compPath) => {
          const __compPath = compPath as string
          const _componentPath = path.isAbsolute(__compPath) ? __compPath.slice(1) : __compPath
          const abCompPath = path.resolve(this.basePath, _componentPath) + '.ts'
          this.entries.push(abCompPath)
          this.createEntries(abCompPath, 'component')
        })
      }
    }
  }

  applyEntry(compiler: Compiler) {
    const { context } = compiler.options
    this.entries
      .map((item) => path.relative(context!, replaceExt(item, '.ts')))
      .forEach((item) => {
        new EntryPlugin(context!, './' + item, replaceExt(item, '')).apply(compiler)
      })
  }

  apply(compiler: Compiler) {
    const isPlugin = process.env.BUILD_TARGET === 'plugin'

    if (isPlugin) {
      const appPath = path.resolve(this.basePath, 'index.ts')
      this.entries.push(appPath)
      const pluginJson = path.resolve(this.basePath, 'plugin.json')
      this.createEntries(pluginJson, 'plugin')
    } else {
      const appPath = path.resolve(this.basePath, 'app.ts')
      this.entries.push(appPath)
      this.createEntries(appPath, 'app')
    }

    compiler.hooks.entryOption.tap('MpEntryWebpackPlugin', () => {
      this.applyEntry(compiler)
      return true
    })

    compiler.hooks.watchRun.tap('MpEntryWebpackPlugin', (compiler) => {
      this.applyEntry(compiler)
    })
  }
}

module.exports = MpEntryWebpackPlugin
