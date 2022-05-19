import { Compiler, EntryPlugin } from 'webpack'
import path from 'path'

export default class AMP {

  // pages 全局记录
  pagesMap = {}

  // 组件资源记录
  componentsMap = {}

  // 静态资源(图片，字体，独立样式)等，依照所属包进行记录
  staticResourcesMap = {}

  compiler: Compiler

  addPage(page = '', pkg = 'main') {
    this.pagesMap[pkg] = this.pagesMap[pkg] || []
    this.pagesMap[pkg].push(page)
  }

  addComponent(comp = '', page = '', pkg = 'main') {
    this.pagesMap[pkg] = this.pagesMap[pkg] || {}
    this.pagesMap[pkg][page] = this.pagesMap[pkg][page] || []
    this.pagesMap[pkg][page].push(comp)
  }

  addEntry(entry) {
    return new EntryPlugin(this.compiler.context, entry).apply(this.compiler)
  }

  getJsonEntry(_path) {
    const { name, dir } = path.parse(_path)
    return require(path.resolve(dir, `${name}.json`))
  }

  getInitEntry(): string[] {
    // @ts-ignore
    return this.compiler.options.entry?.main?.import
  }

  processAppEntry() {
    const entries = this.getInitEntry()

    const formatAppJson = (json) => {
      const base = { main: json.pages }
      if (!json.subPackages) return base
      return json.subPackages.reduce((res, cur) => {
        res[cur.root] = cur.pages
        return res
      }, base)
    }

    entries.forEach(entry => {
      const content = formatAppJson(this.getJsonEntry(entry))
      console.log(content)
    })
  }

  apply(compiler: Compiler) {
    this.compiler = compiler

    this.processAppEntry()

    // const entries = this.getInitEntry()

    // entries.map(entry => this.getJsonEntry(entry))

    // console.log('=========', entry);


    // compiler.options

    // 获取 app.json

  }
}
