import { resolve, isAbsolute, parse, join } from 'path'
import hash from 'hash-sum'
import { jsonExt, MAIN_PACKAGE, useComp } from './constants'
import { Entry, EntryType } from './types'
import parseAmpConf from '../parseAmpConf'

const entries: Entry[] = []

const { sourceRoot, outputRoot, appEntry } = parseAmpConf()

function getJsonEntry(_path) {
  const { name, dir, ext } = parse(_path)
  if (ext) return require(resolve(dir, `${name}${jsonExt}`))
  return require(resolve(dir, name) + jsonExt)
}

function addEntry(entry: Entry) {
  entries.push(entry)
}

function addPage(page = '', pkg = MAIN_PACKAGE) {
  const entry = pagePathResolve(page, pkg)

  const output = entry.replace(resolve(sourceRoot), resolve(outputRoot))

  addEntry({
    type: EntryType.page,
    pkg,
    value: page,
    key: page,
    loc: entry,
    name: parse(join(entry, '..')).name,
    output,
    caller: '',
  })

  travelComponents(entry, page, pkg)
}

function travelComponents(entry, page, pkg) {
  const json = getJsonEntry(entry)
  const compMap = json[useComp]
  if (compMap) {
    Object.entries(compMap).forEach(([key, value]) =>
      addComponent(key, value as string, page, pkg, parse(entry).dir)
    )
  }
}

function addComponent(
  key = '',
  value = '',
  page = '',
  pkg = MAIN_PACKAGE,
  currentDir = ''
) {
  const entry = compPathResolve(value, currentDir)
  const name = `${parse(join(entry, '..')).name.toLowerCase()}-${hash(entry)}`
  const output = resolve(outputRoot) + `/component/${name}/${name}`

  addEntry({
    type: EntryType.comp,
    pkg,
    name,
    value,
    loc: entry,
    output,
    key,
    caller: currentDir,
  })

  travelComponents(entry, page, pkg)
}

function pagePathResolve(page, pkg = MAIN_PACKAGE) {
  return resolve(sourceRoot, pkg === MAIN_PACKAGE ? '' : pkg, page)
}

function compPathResolve(comp, currentDir) {
  if (isAbsolute(comp)) {
    return resolve(sourceRoot) + comp
  }

  try {
    // 兼容 monorepos 结构
    const { dir, name } = parse(require.resolve(comp + jsonExt))
    return resolve(dir, name)
  } catch (e) {
    // 处理 ../../ 路径
    return join(currentDir, comp)
  }
}

export default function getAppEntry() {
  if (entries.length) return entries

  const appJson = getJsonEntry(appEntry)

  if (appJson.pages) {
    appJson.pages.forEach((page) => addPage(page, MAIN_PACKAGE))
  }

  if (appJson.subPackages) {
    appJson.subPackages.forEach((pkg) => {
      const { root, pages } = pkg
      pages.forEach((page) => addPage(page, root))
    })
  }

  return entries
}
