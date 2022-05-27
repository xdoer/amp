import path from 'path'
import { empty } from './constants'
import parseAmpConf from './parseAmpConf'

export function getBaseOutput(_path) {
  const { sourceRoot, outputRoot } = parseAmpConf()
  return _path.replace(path.resolve(sourceRoot), path.resolve(outputRoot))
}

export function getRelativeOutput(_path) {
  const { outputRoot } = parseAmpConf()
  return _path.replace(path.resolve(outputRoot), empty)
}

// 组件引用规范为绝对路径
export function normalizeCompPath(name: string) {
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

export function createRelativePath(path) {
  return /^\./.test(path) ? path : './' + path
}

export function merge(target, source) {
  return Object.assign({}, target, source)
}
