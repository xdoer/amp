import { Compiler, EntryPlugin, Compilation, sources, Chunk } from 'webpack'
import fs, { constants } from 'fs'
import path, { resolve } from 'path'
import { ampEntry } from '../entry'
import parseAmpConf from '../parseAmpConf'
import { runtimeCodeFixBabel, runtimeCodeCtxObject } from '../constants'
import { getRelativeOutput, createRelativePath } from '../utils'
import { platformConf } from '../ampConf'

const { outputRoot, style, platform } = parseAmpConf()

export default class AmpWebpackPlugin {

  compiler: Compiler

  // 动态添加入口
  applyEntry() {
    const { xml, css, json } = platformConf[platform].ext

    ampEntry.entryOutputMap.forEach((output, loc) => {
      // https://webpack.js.org/plugins/internal-plugins/#entryplugin
      const out = getRelativeOutput(output)

      // 每个单元下, 必须有的
      const requiredExts = ['', xml]

      requiredExts.forEach(ext => new EntryPlugin(this.compiler.context, loc + ext, out).apply(this.compiler))

      // 可能有的，需要先检验文件存不存在
      const checkExts = style ? [style, css, `${json}?asConfig`] : [css, `${json}?asConfig`]

      for (let i = 0; i < checkExts.length; i++) {
        const ext = checkExts[i];
        try {
          fs.accessSync(loc + ext, constants.R_OK)
          new EntryPlugin(this.compiler.context, loc + ext, out).apply(this.compiler)
          break
        } catch (e) { }
      }
    })
  }

  // chunk 添加依赖
  applyChunkRequire() {
    // https://github.com/didi/mpx/blob/c034d454986fe1f932784f26295d59328da951c3/packages/webpack-plugin/lib/index.js#L1145
    this.compiler.hooks.thisCompilation.tap('AmpWebpackPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'AmpWebpackPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        () => {
          const { globalObject, chunkLoadingGlobal } = compilation.outputOptions

          const processedChunk = new Set()
          const appName = 'app'

          function processChunk(chunk: Chunk, isRuntime: boolean, relativeChunks: Chunk[]) {
            const chunkFile = chunk.files.values().next().value
            if (!chunkFile || processedChunk.has(chunk)) return

            let originalSource = compilation.assets[chunkFile]
            const source = new sources.ConcatSource()
            source.add(`\nvar ${globalObject} = ${globalObject} || {};\n\n`)

            relativeChunks.forEach((relativeChunk, index) => {
              const relativeChunkFile = relativeChunk.files.values().next().value
              if (!relativeChunkFile) return

              const x = (chunk) => (chunk[0] === '/' ? '' : '/') + chunk
              const relativePath = createRelativePath(path.relative(path.dirname(resolve(outputRoot) + x(chunkFile)), resolve(outputRoot) + x(relativeChunkFile)))

              if (index === 0) {
                if (chunk.name === appName) {
                  source.add(runtimeCodeCtxObject)
                  source.add(`context[${JSON.stringify(chunkLoadingGlobal)}] = ${globalObject}[${JSON.stringify(chunkLoadingGlobal)}] = require("${relativePath}");\n`)
                } else {
                  // 其余chunk中通过context全局传递runtime
                  source.add(runtimeCodeCtxObject)
                  source.add(`${globalObject}[${JSON.stringify(chunkLoadingGlobal)}] = context[${JSON.stringify(chunkLoadingGlobal)}];\n`)
                }
              } else {
                source.add(`require("${relativePath}");\n`)
              }
            })

            if (isRuntime) {
              source.add(runtimeCodeCtxObject)
              source.add(runtimeCodeFixBabel)
              source.add(originalSource)
              source.add(`\nmodule.exports = ${globalObject}[${JSON.stringify(chunkLoadingGlobal)}];\n`)
            } else {
              source.add(originalSource)
            }

            compilation.assets[chunkFile] = source
            processedChunk.add(chunk)
          }

          compilation.chunkGroups.forEach((chunkGroup) => {
            if (!chunkGroup.isInitial()) return

            let runtimeChunk, entryChunk
            const middleChunks: any = []

            const chunksLength = chunkGroup.chunks.length

            chunkGroup.chunks.forEach((chunk, index) => {
              if (index === 0) {
                runtimeChunk = chunk
              } else if (index === chunksLength - 1) {
                entryChunk = chunk
              } else {
                middleChunks.push(chunk)
              }
            })

            if (runtimeChunk) {
              processChunk(runtimeChunk, true, [])
              if (middleChunks.length) {
                middleChunks.forEach((middleChunk) => {
                  processChunk(middleChunk, false, [runtimeChunk])
                })
              }
              if (entryChunk) {
                middleChunks.unshift(runtimeChunk)
                processChunk(entryChunk, false, middleChunks)
              }
            }
          })
        })
    })
  }

  apply(compiler: Compiler) {
    this.compiler = compiler
    this.applyEntry()
    this.applyChunkRequire()
  }
}
