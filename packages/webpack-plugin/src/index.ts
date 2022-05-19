import webpack from 'webpack'
import addQuery from "./utils/add-query"
import SplitChunksPlugin from 'webpack/lib/optimize/SplitChunksPlugin'
import NormalModule from 'webpack/lib/NormalModule'
import parseRequest from './utils/parse-request'
import path from 'path'
const AppEntryDependency = require('./dependencies/AppEntryDependency')
const RecordResourceMapDependency = require('./dependencies/RecordResourceMapDependency')
const RecordGlobalComponentsDependency = require('./dependencies/RecordGlobalComponentsDependency')
const RecordIndependentDependency = require('./dependencies/RecordIndependentDependency')
const DynamicEntryDependency = require('./dependencies/DynamicEntryDependency')
const FlagPluginDependency = require('./dependencies/FlagPluginDependency')
const RemoveEntryDependency = require('./dependencies/RemoveEntryDependency')
const ResolveDependency = require('./dependencies/ResolveDependency')
const InjectDependency = require('./dependencies/InjectDependency')
const ReplaceDependency = require('./dependencies/ReplaceDependency')
const CommonJsVariableDependency = require('./dependencies/CommonJsVariableDependency')
const CommonJsAsyncDependency = require('./dependencies/CommonJsAsyncDependency')
const NullFactory = require('webpack/lib/NullFactory')
const hash = require('hash-sum')


const isProductionLikeMode = options => {
  return options.mode === 'production' || !options.mode
}

interface Options {
  writeMode: string //https://www.mpxjs.cn/api/compile.html#writemode
  autoScopeRules: string  // https://www.mpxjs.cn/api/compile.html#autoscoperules
}

class AmpWebpackPlugin {

  constructor() {

  }

  static getPageEntry(request) {
    return addQuery(request, { isPage: true })
  }

  static getComponentEntry(request) {
    return addQuery(request, { isComponent: true })
  }


  apply(compiler: webpack.Compiler) {
    let amp
    let splitChunksPlugin
    let splitChunksOptions

    const optimization = compiler.options.optimization

    // 优化项
    splitChunksOptions = Object.assign({
      defaultSizeTypes: ['javascript', 'unknown'],
      chunks: 'all',
      usedExports: optimization.usedExports === true,
      minChunks: 1,
      minSize: 1000,
      enforceSizeThreshold: Infinity,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '-'
    }, optimization.splitChunks)
    delete optimization.splitChunks
    splitChunksPlugin = new SplitChunksPlugin(splitChunksOptions)
    splitChunksPlugin.apply(compiler)

    // 优化项 https://mpxjs.cn/api/compile.html#writemode
    const writedFileContentMap = new Map()
    const originalWriteFile = compiler.outputFileSystem.writeFile
    compiler.outputFileSystem.writeFile = (filePath, content, callback) => {
      const lastContent = writedFileContentMap.get(filePath)
      if (Buffer.isBuffer(lastContent) ? lastContent.equals(content as Buffer) : lastContent === content) {
        return callback()
      }
      writedFileContentMap.set(filePath, content)
      originalWriteFile(filePath, content, callback)
    }

    const getPackageCacheGroup = () => {
      return {
        // 对于独立分包模块不应用该cacheGroup
        test: (module) => {
          let isIndependent = false
          if (module.resource) {
            parseRequest
            const { queryObj } = parseRequest(module.resource)
            isIndependent = !!queryObj.independent
          } else {
            const identifier = module.identifier()
            isIndependent = /\|independent=/.test(identifier)
          }
          return !isIndependent
        },
        name: 'bundle',
        minChunks: 2,
        chunks: 'all'
      }
    }

    compiler.hooks.compilation.tap('AmpWebpackPlugin ', (compilation, { normalModuleFactory }) => {
      NormalModule.getCompilationHooks(compilation).loader.tap('AmpWebpackPlugin', (loaderContext) => {
        // 设置loaderContext的minimize
        if (isProductionLikeMode(compiler.options)) {
          loaderContext.minimize = true
        }

        loaderContext.getAmp = () => amp
      })
      compilation.dependencyFactories.set(ResolveDependency, new NullFactory())
      compilation.dependencyTemplates.set(ResolveDependency, new ResolveDependency.Template())

      compilation.dependencyFactories.set(InjectDependency, new NullFactory())
      compilation.dependencyTemplates.set(InjectDependency, new InjectDependency.Template())

      compilation.dependencyFactories.set(ReplaceDependency, new NullFactory())
      compilation.dependencyTemplates.set(ReplaceDependency, new ReplaceDependency.Template())

      compilation.dependencyFactories.set(AppEntryDependency, new NullFactory())
      compilation.dependencyTemplates.set(AppEntryDependency, new AppEntryDependency.Template())

      compilation.dependencyFactories.set(DynamicEntryDependency, new NullFactory())
      compilation.dependencyTemplates.set(DynamicEntryDependency, new DynamicEntryDependency.Template())

      compilation.dependencyFactories.set(FlagPluginDependency, new NullFactory())
      compilation.dependencyTemplates.set(FlagPluginDependency, new FlagPluginDependency.Template())

      compilation.dependencyFactories.set(RemoveEntryDependency, new NullFactory())
      compilation.dependencyTemplates.set(RemoveEntryDependency, new RemoveEntryDependency.Template())

      compilation.dependencyFactories.set(RecordResourceMapDependency, new NullFactory())
      compilation.dependencyTemplates.set(RecordResourceMapDependency, new RecordResourceMapDependency.Template())

      compilation.dependencyFactories.set(RecordGlobalComponentsDependency, new NullFactory())
      compilation.dependencyTemplates.set(RecordGlobalComponentsDependency, new RecordGlobalComponentsDependency.Template())

      compilation.dependencyFactories.set(RecordIndependentDependency, new NullFactory())
      compilation.dependencyTemplates.set(RecordIndependentDependency, new RecordIndependentDependency.Template())

      compilation.dependencyFactories.set(CommonJsVariableDependency, normalModuleFactory)
      compilation.dependencyTemplates.set(CommonJsVariableDependency, new CommonJsVariableDependency.Template())

      compilation.dependencyFactories.set(CommonJsAsyncDependency, normalModuleFactory)
      compilation.dependencyTemplates.set(CommonJsAsyncDependency, new CommonJsAsyncDependency.Template())
    })

    // 根据 json 文件，找到一个依赖树

    compiler.hooks.thisCompilation.tap('AmpWebpackPlugin', (compilation: webpack.Compilation & { __amp__: any }, { normalModuleFactory }) => {
      if (!compilation.__amp__) {
        amp = compilation.__amp__ = {
          // app信息，便于获取appName
          appInfo: {},
          // pages全局记录，无需区分主包分包
          pagesMap: {},
          // 组件资源记录，依照所属包进行记录
          componentsMap: {},
          // 静态资源(图片，字体，独立样式)等，依照所属包进行记录
          staticResourcesMap: {},
          // 记录其他资源，如pluginMain、pluginExport，无需区分主包分包
          otherResourcesMap: {},
          replacePathMap: {},
          exportModules: new Set(),
          // 记录entryModule与entryNode的对应关系，用于体积分析
          entryNodeModulesMap: new Map(),
          // 记录与asset相关联的modules，用于体积分析
          assetsModulesMap: new Map(),
          // 记录与asset相关联的ast，用于体积分析和esCheck，避免重复parse
          assetsASTsMap: new Map(),
          usingComponents: {},
          tabBarMap: {},
          pathHash: (resourcePath) => {
            if (this.options.pathHashMode === 'relative' && this.options.projectRoot) {
              return hash(path.relative(this.options.projectRoot, resourcePath))
            }
            return hash(resourcePath)
          },
          addEntry(request, name, callback) {
            const dep = EntryPlugin.createDependency(request, { name })
            compilation.addEntry(compiler.context, dep, { name }, callback)

            return dep
          },

        }
      }
    })
  }
}

// app.ts
