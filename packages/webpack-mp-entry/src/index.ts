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
      case 'app': {
        config.pages.forEach((page: string) => {
          const pagePath = this.basePath + '/' + page + '.ts'
          this.entries.push(pagePath)
          this.createEntries(pagePath, 'page')
        })
        break
      }
      case 'component':
      case 'page': {
        if (config.usingComponents) {
          Object.values(config.usingComponents).map((compPath) => {
            const abCompPath = this.basePath + compPath + '.ts'
            this.entries.push(abCompPath)
            this.createEntries(abCompPath, 'component')
          })
        }
      }
    }

    // less file
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
    const appPath = path.resolve(this.basePath, 'app.ts')
    this.entries.push(appPath)
    this.createEntries(appPath, 'app')

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
