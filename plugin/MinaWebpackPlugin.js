const EntryPlugin = require('webpack/lib/EntryPlugin')
const path = require('path')
const fs = require('fs')
const replaceExt = require('replace-ext')

function _inflateEntries(entries = [], dirname, entry) {
  const configFile = replaceExt(entry, '.json')
  const content = fs.readFileSync(configFile, 'utf8')
  const config = JSON.parse(content)

  ;['pages', 'usingComponents'].forEach((key) => {
    const items = config[key]
    if (typeof items === 'object') {
      Object.values(items).forEach((item) =>
        inflateEntries(entries, dirname, item)
      )
    }
  })
}

function inflateEntries(entries, dirname, entry) {
  entry = path.resolve(dirname, entry)
  if (entry != null && !entries.includes(entry)) {
    entries.push(entry)
    _inflateEntries(entries, path.dirname(entry), entry)
  }
}

class MinaWebpackPlugin {
  constructor() {
    this.entries = []
  }

  applyEntry(compiler, done) {
    const { context } = compiler.options
    this.entries
      .map((item) => replaceExt(item, '.ts'))
      .map((item) => path.relative(context, item))
      .forEach((item) =>
        new EntryPlugin(context, './' + item, replaceExt(item, '')).apply(
          compiler
        )
      )
    if (done) {
      done()
    }
  }

  // apply 是每一个插件的入口
  apply(compiler) {
    const { context, entry } = compiler.options
    const appjs = entry.main.import[0]

    // 找到所有的入口文件，存放在 entries 里面
    inflateEntries(this.entries, context, appjs)

    compiler.hooks.entryOption.tap('MinaWebpackPlugin', () => {
      this.applyEntry(compiler)
      return true
    })

    // 监听 watchRun 事件
    compiler.hooks.watchRun.tap('MinaWebpackPlugin', (compiler, done) => {
      this.applyEntry(compiler, done)
    })
  }
}
module.exports = MinaWebpackPlugin
