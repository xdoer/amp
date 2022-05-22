import { parseQuery } from 'loader-utils'
import { getAMPEntry } from '../entry'
import parseAmpConf from '../parseAmpConf'
import { resolve, join, parse } from 'path'
import { useComp, jsonExt, empty } from '../constants'
import fs from 'fs-extra'

const { outputRoot, sourceRoot } = parseAmpConf()

// 组件引用规范为绝对路径(有需要再调整)
function normalizePath(name: string) {
  return `/components/${name}/index`
}

module.exports = function (source) {
  const { asConfig, type } = parseQuery(this.resourceQuery)

  /**
   * 配置类的 json 需要在路径后加 asConfig 参数
   */
  if (asConfig) {
    const json = JSON.parse(source)
    const compMap = json[useComp] || {}

    let output = ''

    getAMPEntry()
      .forEach(({ caller, key, value, name, loc, output: _output }) => {

        // 拿到当前资源要输出的目录
        if (this.resourcePath === loc + jsonExt) output = _output

        if (!this.resourcePath.includes(caller)) return
        if (compMap[key] !== value) return

        // 格式化组件的路径
        compMap[key] = normalizePath(name)
      })

    if (type === 'app') {
      const { dir } = parse(this.resourcePath)

      function emitAssets(icon) {
        if (icon) {
          const iconPath = join(dir, icon)
          const distPath = resolve(outputRoot) + iconPath.replace(resolve(sourceRoot), empty)
          fs.ensureDirSync(parse(distPath).dir)
          fs.copyFileSync(iconPath, distPath)
        }
      }

      // 处理 tabbar 图片资源
      if (json.tabBar) {
        json.tabBar.items.forEach(item => {
          const { icon, activeIcon } = item
          emitAssets(icon)
          emitAssets(activeIcon)
        })
      }
    }

    if (output) {
      output = output.replace(resolve(outputRoot), empty) + jsonExt
    } else {
      output = this.resourcePath.replace(resolve(sourceRoot), empty)
    }

    this.emitFile(output, JSON.stringify(json, null, 2))
    return ''
  }

  return `
  var json = ${JSON.stringify(source, null, 2)};
  module.exports = JSON.stringify(json, null, 2);\n
`
}
