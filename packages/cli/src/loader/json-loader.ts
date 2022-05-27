import fs from 'fs-extra'
import { parseQuery } from 'loader-utils'
import { resolve, join, parse } from 'path'
import { ampEntry } from '../entry'
import parseAmpConf from '../parseAmpConf'
import { useComp, empty } from '../constants'
import { getRelativeOutput, isRelativeUrl, normalizeCompPath } from '../utils'


module.exports = function (source) {
  const { asConfig, type } = parseQuery(this.resourceQuery)
  const { outputRoot, sourceRoot } = parseAmpConf()

  /**
   * 配置类的 json 需要在路径后加 asConfig 参数
   */
  if (asConfig) {
    const json = JSON.parse(source)
    const compMap = json[useComp] || {}

    // 当前资源文件的引用
    const entries = ampEntry.getResourceEntries(this.resourcePath)

    entries
      .forEach((entry) => {
        const { key, value, name } = entry
        if (compMap[key] !== value) return

        // 格式化组件的路径
        compMap[key] = normalizeCompPath(name)
      })

    if (type === 'app') {
      const { dir } = parse(this.resourcePath)

      function emitAssets(icon) {
        if (isRelativeUrl(icon)) {
          const iconPath = join(dir, icon)
          const distPath = resolve(outputRoot) + iconPath.replace(resolve(sourceRoot), empty)
          // TODO: 资源文件可以加到 webpack 构建流程
          fs.ensureDirSync(parse(distPath).dir)
          fs.copyFileSync(iconPath, distPath)
        }
      }

      // 处理 tabBar 图片资源
      if (json.tabBar) {
        json.tabBar.items.forEach(item => {
          const { icon, activeIcon } = item
          emitAssets(icon)
          emitAssets(activeIcon)
        })
      }
    }

    const output = ampEntry.getResourceOutput(this.resourcePath)

    this.emitFile(getRelativeOutput(output), JSON.stringify(json, null, 2))

    return `
      module.exports = { resourcePath: "${this.resourcePath}", outputPath: "${output}" }
    `
  }

  return `
  var json = ${JSON.stringify(source, null, 2)};
  module.exports = JSON.stringify(json, null, 2);\n
`
}
