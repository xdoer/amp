import attrParse from './attr-parse'
import path from 'path'
import { isUrlRequest } from 'loader-utils'
import { getAMPEntry } from '../../entry'
import parseAmpConf from '../../parseAmpConf'
import { empty } from '../../constants'
import fs from 'fs-extra'

const { outputRoot } = parseAmpConf()

function isUrlRequest(url) {
  // 对于非字符串或空字符串url直接返回false
  if (!url || typeof url !== 'string') return false
  // 网络链接
  if (/^.+:\/\//.test(url)) return false
  // 对于url中存在Mustache插值的情况也返回false
  if (/\{\{((?:.|\n|\r)+?)\}\}(?!})/.test(url)) return false
  return true
}

module.exports = function xmlLoader(source) {
  this.cacheable()
  const { dir, ext } = path.parse(this.resourcePath)
  const entry = getAMPEntry().find(entry => entry.loc.includes(dir))

  if (!entry) return ''

  const { output } = entry

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
    .filter(link => isUrlRequest(link.value))
    .forEach(link => {
      const currentPath = path.join(dir, link.value)
      const _dir = path.parse(output).dir
      const outputPath = path.join(_dir, link.value)

      fs.ensureDirSync(path.parse(outputPath).dir)
      fs.copyFileSync(currentPath, outputPath)
    })

  this.emitFile(entry.output.replace(path.resolve(outputRoot), empty) + ext, source)

  return ''
}
