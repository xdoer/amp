import fs from 'fs-extra'
import path from 'path'
import attrParse from './attr-parse'
import { ampEntry } from '../../entry'
import { getRelativeOutput, isRelativeUrl } from '../../utils'

module.exports = function xmlLoader(source) {
  const { dir } = path.parse(this.resourcePath)

  const output = ampEntry.getResourceOutput(this.resourcePath)

  const attributes = ['image:src', 'audio:src', 'video:src', 'cover-image:src', 'import:src', 'include:src', 'import-sjs:from']

  const links = attrParse(source, function (tag, attr) {
    const res = attributes.find(function (a) {
      if (a.charAt(0) === ':') {
        return attr === a.slice(1)
      } else {
        return (tag + ':' + attr) === a
      }
    })
    return !!res
  })


  // 解析 xml 中的相对路径资源进行拷贝
  links
    .filter(link => isRelativeUrl(link.value))
    .forEach(link => {
      const currentPath = path.join(dir, link.value)
      const _dir = path.parse(output).dir
      const outputPath = path.join(_dir, link.value)

      // TODO: 产生的资源应当加入 webpack 构建流中
      fs.ensureDirSync(path.parse(outputPath).dir)
      fs.copyFileSync(currentPath, outputPath)
    })

  this.emitFile(getRelativeOutput(output), source)

  return `
      module.exports = { resourcePath: "${this.resourcePath}", outputPath: "${output}" }
    `
}
