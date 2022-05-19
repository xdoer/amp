import { Compiler, EntryPlugin } from 'webpack'
import path from 'path'

export class AMP {
  // amp 配置信息
  config = {}

  // pages 全局记录
  pagesMap = {}

  // 组件资源记录
  componentsMap = {}

  // 静态资源(图片，字体，独立样式)等，依照所属包进行记录
  staticResourcesMap = {}

  constructor(private compiler: Compiler) { }

  addPage(page = '', pkg = 'main') {
    this.pagesMap[pkg] = this.pagesMap[pkg] || []
    this.pagesMap[pkg].push(page)
  }

  addComponent(comp = '', page = '', pkg = 'main') {
    this.pagesMap[pkg] ||= {}
    this.pagesMap[pkg][page] ||= []
    this.pagesMap[pkg][page].push(comp)
  }

  addEntry(entry) {
    return new EntryPlugin(this.compiler.context, entry).apply(this.compiler)
  }

  getJson(_path) {
    const { name, dir } = path.parse(_path)
    return require(path.resolve(dir, `${name}.json`))
  }



  apply(compiler: Compiler) {
    this.compiler = compiler

    compiler.options

    // 获取 app.json

  }
}
