import path from 'path'
import { empty } from './constants'
import parseAmpConf from './parseAmpConf'

const { sourceRoot, outputRoot } = parseAmpConf()

export function getBaseOutput(_path) {
  return _path.replace(path.resolve(sourceRoot), path.resolve(outputRoot))
}

export function getRelativeOutput(_path) {
  return _path.replace(path.resolve(outputRoot), empty)
}

// 组件引用规范为绝对路径
export function normalizePath(name: string) {
  return `/components/${name}/index`
}

export function isRelativeUrl(url: string): boolean {
  // 对于非字符串或空字符串url直接返回false
  if (!url || typeof url !== 'string') return false
  // 网络链接
  if (/^.+:\/\//.test(url)) return false
  // 对于url中存在Mustache插值的情况也返回false
  if (/\{\{((?:.|\n|\r)+?)\}\}(?!})/.test(url)) return false
  return true
}
