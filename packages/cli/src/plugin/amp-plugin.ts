import { Compiler, EntryPlugin, Compilation, sources } from 'webpack'
import path, { resolve } from 'path'
import { getAMPEntryUniq } from '../entry'
import parseAmpConf from '../parseAmpConf'
import fs, { constants } from 'fs'

function fix(path) {
  if (!/^\./.test(path)) {
    return './' + path
  }
  return path
}

export default class AmpWebpackPlugin {
  apply(compiler: Compiler) {
    const { outputRoot } = parseAmpConf()

    // 添加 entry
    getAMPEntryUniq('loc').forEach(entry => {
      const { loc, output } = entry
      // https://webpack.js.org/plugins/internal-plugins/#entryplugin
      const out = output.replace(resolve(outputRoot), '')

      const exts = ['.ts', '.js', '.json', '.axml', '.sjs']

      exts.forEach(ext => {
        const target = loc + ext

        try {
          fs.accessSync(target, constants.R_OK)
          new EntryPlugin(compiler.context, target + (ext === '.json' ? '?asConfig' : ''), out).apply(compiler)
        } catch (e) {

        }
      })
    })

    // 拆除文件
    compiler.hooks.thisCompilation.tap('AmpWebpackPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'AmpWebpackPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        () => {
          const { globalObject, chunkLoadingGlobal } = compilation.outputOptions

          const processedChunk = new Set()
          const appName = 'app'

          function processChunk(chunk, isRuntime, relativeChunks) {
            const chunkFile = chunk.files.values().next().value
            if (!chunkFile || processedChunk.has(chunk)) return

            let originalSource = compilation.assets[chunkFile]
            const source = new sources.ConcatSource()
            source.add(`\nvar ${globalObject} = ${globalObject} || {};\n\n`)

            relativeChunks.forEach((relativeChunk, index) => {
              const relativeChunkFile = relativeChunk.files.values().next().value
              if (!relativeChunkFile) return

              const x = (chunk) => (chunk[0] === '/' ? '' : '/') + chunk
              const relativePath = fix(path.relative(path.dirname(resolve(outputRoot) + x(chunkFile)), resolve(outputRoot) + x(relativeChunkFile)))

              if (index === 0) {
                if (chunk.name === appName) {
                  // 在rootChunk中挂载jsonpCallback
                  source.add('// process ali subpackages runtime in root chunk\n' +
                    'var context = (function() { return this })() || Function("return this")();\n\n')
                  source.add(`context[${JSON.stringify(chunkLoadingGlobal)}] = ${globalObject}[${JSON.stringify(chunkLoadingGlobal)}] = require("${relativePath}");\n`)
                } else {
                  // 其余chunk中通过context全局传递runtime
                  source.add('// process ali subpackages runtime in other chunk\n' +
                    'var context = (function() { return this })() || Function("return this")();\n\n')
                  source.add(`${globalObject}[${JSON.stringify(chunkLoadingGlobal)}] = context[${JSON.stringify(chunkLoadingGlobal)}];\n`)
                }

              } else {
                source.add(`require("${relativePath}");\n`)
              }
            })

            if (isRuntime) {
              source.add('var context = (function() { return this })() || Function("return this")();\n')
              source.add(`
// Fix babel runtime in some quirky environment like ali & qq dev.
try {
  if(!context.console){
    context.console = console;
    context.setInterval = setInterval;
    context.setTimeout = setTimeout;
    context.JSON = JSON;
    context.Math = Math;
    context.Date = Date;
    context.RegExp = RegExp;
    context.Infinity = Infinity;
    context.isFinite = isFinite;
    context.parseFloat = parseFloat;
    context.parseInt = parseInt;
    context.Promise = Promise;
    context.WeakMap = WeakMap;
    context.RangeError = RangeError;
    context.TypeError = TypeError;
    context.Uint8Array = Uint8Array;
    context.DataView = DataView;
    context.ArrayBuffer = ArrayBuffer;
    context.Symbol = Symbol;
    context.Reflect = Reflect;
    context.Object = Object;
    context.Error = Error;
    context.Array = Array;
    context.Float32Array = Float32Array;
    context.Float64Array = Float64Array;
    context.Int16Array = Int16Array;
    context.Int32Array = Int32Array;
    context.Int8Array = Int8Array;
    context.Uint16Array = Uint16Array;
    context.Uint32Array = Uint32Array;
    context.Uint8ClampedArray = Uint8ClampedArray;
    context.String = String;
    context.Function = Function;
    context.SyntaxError = SyntaxError;
    context.decodeURIComponent = decodeURIComponent;
    context.encodeURIComponent = encodeURIComponent;
  }
} catch(e){
}\n`)
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
            let middleChunks: any = []

            let chunksLength = chunkGroup.chunks.length

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
}
