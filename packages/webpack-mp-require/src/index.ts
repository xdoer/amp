import path from 'path'
import { ConcatSource } from 'webpack-sources'
const requiredPath = require('required-path')
import { Compiler, javascript } from 'webpack'

function isRuntimeExtracted(compilation: any) {
  return [...compilation.chunks].some(
    (chunk) =>
      chunk.isOnlyInitial() && chunk.hasRuntime() && !chunk.hasEntryModule()
  )
}

function script({ dependencies }: any) {
  return (
    ';' +
    dependencies
      .map((file: any) => {
        return `require('${requiredPath(file)}');`
      })
      .join('')
  )
}

class MpRequireWebpackPlugin {
  runtime: any

  constructor(options: any = {}) {
    this.runtime = options.runtime || ''
  }

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap('MpRequirePlugin', (compilation) => {
      const callback = (source: any, entry: any) => {
        if (!isRuntimeExtracted(compilation)) {
          throw new Error(
            [
              'Please reuse the runtime chunk to avoid duplicate loading of javascript files.',
              "Simple solution: set `optimization.runtimeChunk` to `{ name: 'runtime.js' }` .",
              'Detail of `optimization.runtimeChunk`: https://webpack.js.org/configuration/optimization/#optimization-runtimechunk .',
            ].join('\n')
          )
        }

        // 如果不是入口 chunk，即不是通过 compilation.addEntry 添加的模块所生成的 chunk，就不要管它
        if (!entry.chunk.hasEntryModule()) {
          return source
        }

        let dependencies: any = []
        // 找到该入口 chunk 依赖的其它所有 chunk
        entry.chunk.groupsIterable.forEach((group: any) => {
          group.chunks.forEach((chunk: any) => {
            /**
             * assume output.filename is chunk.name here
             */
            let filename = path.relative(
              path.dirname(entry.chunk.name),
              chunk.name
            )

            if (chunk === entry || ~dependencies.indexOf(filename)) {
              return
            }
            dependencies.push(filename)
          })
        })

        // 在源码前面拼接 runtime 以及公共代码依赖
        source = new ConcatSource(script({ dependencies }), source)
        return source
      }

      const getCompilationHooks = javascript.JavascriptModulesPlugin.getCompilationHooks(compilation)
      getCompilationHooks.renderMain.tap('MpRequirePlugin', callback)
      getCompilationHooks.renderChunk.tap('MpRequirePlugin', callback)
    })
  }
}

module.exports = MpRequireWebpackPlugin
