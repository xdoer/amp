import { parseQuery } from 'loader-utils'
import getAMPEntry from '../entry'
import parseAmpConf from '../parseAmpConf'
import { resolve } from 'path'

const { outputRoot, sourceRoot } = parseAmpConf()

module.exports = async function (source) {
  const { asConfig } = parseQuery(this.resourceQuery)

  /**
   * 配置类的 json 需要在路径后加 asConfig 参数
   */
  if (asConfig) {
    const json = JSON.parse(source)
    const compMap = json['usingComponents'] || {}

    let output = ''

    getAMPEntry()
      .forEach(({ caller, key, value, name, loc, output: _output }) => {

        // 拿到当前资源要输出的目录
        if (this.resourcePath === loc + '.json') output = _output

        if (!this.resourcePath.includes(caller)) return
        if (compMap[key] !== value) return

        // 组件引用规范为绝对路径(有需要再调整成可配置)
        compMap[key] = `/components/${name}/${name}`
      })

    if (output) {
      output = output.replace(resolve(outputRoot), '') + '.json'
    } else {
      output = this.resourcePath.replace(resolve(sourceRoot), '')
    }

    this.emitFile(output, JSON.stringify(json, null, 2))
    return ''
  }

  return `
  var json = ${JSON.stringify(source, null, 2)};
  module.exports = JSON.stringify(json, null, 2);\n
`
}
