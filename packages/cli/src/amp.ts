import { Compiler, EntryPlugin } from 'webpack'
import { resolve, isAbsolute, parse, join } from 'path'
import parseAmpConf from './parseAmpConf'

const { sourceRoot } = parseAmpConf()
export default class AMP {

  entries = new Set()

  // pages 全局记录
  pagesMap = {}

  // 组件资源记录
  componentsMap = {}

  // 静态资源(图片，字体，独立样式)等，依照所属包进行记录
  staticResourcesMap = {}

  compiler: Compiler

  addPage(page = '', pkg = 'main') {
    this.pagesMap[pkg] = this.pagesMap[pkg] || new Set()
    this.pagesMap[pkg].add(this.pagePathResolve(page, pkg))
  }

  addComponent(comp = '', page = '', pkg = 'main', dir = '') {
    const compPath = this.compPathResolve(comp, dir || this.pagePathResolve(page, pkg))
    this.componentsMap[pkg] = this.componentsMap[pkg] || {}
    this.componentsMap[pkg][page] = this.componentsMap[pkg][page] || new Set()
    this.componentsMap[pkg][page].add(compPath)

    const json = this.getJsonEntry(compPath)
    const compMap = json['usingComponents']
    if (compMap) {
      Object.values(compMap).forEach((comp: string) => {
        this.addComponent(comp, page, pkg, parse(compPath).dir)
      })
    }
  }

  addEntry(entry) {
    return new EntryPlugin(this.compiler.context, entry).apply(this.compiler)
  }

  pagePathResolve(page, pkg = 'main') {
    return resolve(sourceRoot, pkg === 'main' ? '' : pkg, page)
  }

  compPathResolve(comp, dir) {
    if (isAbsolute(comp)) {
      return resolve(sourceRoot) + comp
    }

    try {
      // 兼容 memorepo 结构
      const { dir, name } = parse(require.resolve(comp + '.json'))
      return resolve(dir, name)
    } catch (e) {
      return join(dir, comp)
    }
  }

  getJsonPath(_path,) {
    const { name, dir, ext } = parse(_path)
    if (ext) return resolve(dir, `${name}.json`)
    return resolve(dir, name) + '.json'
  }

  getJsonEntry(_path) {
    return require(this.getJsonPath(_path))
  }

  getInitEntry(): string[] {
    // @ts-ignore
    return this.compiler.options.entry?.main?.import?.[0]
  }

  processPagesEntry() {
    const appEntry = this.getInitEntry()
    const appJson = this.getJsonEntry(appEntry)

    if (appJson.pages) {
      appJson.pages.forEach(page => this.addPage(page, 'main'))
    }

    if (appJson.subPackages) {
      appJson.subPackages.forEach(pkg => {
        const { root, pages } = pkg
        pages.forEach(page => this.addPage(page, root))
      })
    }
  }

  processCompEntry() {
    Object.keys(this.pagesMap).forEach(pkg => {
      this.pagesMap[pkg].forEach(page => {
        const pageJson = this.getJsonEntry(this.pagePathResolve(page, pkg))
        const compMap = pageJson['usingComponents']
        if (compMap) {
          Object.values(compMap).forEach((comp: string) => {
            this.addComponent(comp, page, pkg)
          })
        }
      })
    })
  }

  apply(compiler: Compiler) {
    this.compiler = compiler

    this.processPagesEntry()
    this.processCompEntry()

    console.log(this.pagesMap, this.componentsMap);

  }
}
