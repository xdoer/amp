# mpx 渐进式接入 demo

已有的微信小程序可以快速、无伤、渐进式地接入 mpx，此处我们以一个 UI 库的 example 为例子：

https://github.com/TalkingData/iview-weapp/tree/master/examples

我们来看看如何让这个示例快速接入 mpx 吧。

本项目是最终完成态，用户可通过 `npm i && npm run build` ，使用开发者工具导入本文件夹即可看到效果。

## 迁移步骤

总的步骤就是，利用脚手架创建项目，复制原始项目的所有东西到 src 下面，替换 app 相关的三个文件为 app.mpx

以下是细节，用户可跟随步骤尝试一遍，任何问题欢迎 issue 反馈：

1. 使用@mpxjs/cli 生成一个 mpx 项目：mpx init 项目名
2. 删除项目本来带有的 pages 和 components 文件夹
3. 复制 app.json \ app.js \ app.wxss 三个文件到 app.mpx 对应的块里
4. 复制 iview-examples 里的 pages 到 src 下面，就像项目本来的 pages 文件夹一样
5. 复制 iview 项目的 dist 到 src 下面（这一点其实属于 iview-example 本身没做好，如果你尝试它会发现也需要进行这一步否则打不开）
6. 执行 npm run build 或 npm run prod 完成。

整个过程要不了 5 分钟，迁移你的项目成为一个 mpx 项目也是一样的高效！

> 此项目不代表在 mpx 中使用 ui 组件库的方式，仅是使用一个现有项目证明迁移 mpx 很方便，ui 库的使用请看[这个示例](../mpx-useuilib)

## 使用 mpx

假设本项目要进一步开发，希望用上 mpx 的特性，比如单文件，可以很轻松地新建一个 mpx 文件，和之前的原生小程序文件混合在一起，通过 mpx 的构建得到最终的代码。

比如我们希望修改一下 index 页面，原本的 index 页面位于/pages/index/index。  
（为什么是 index/index？因为小程序一个页面由四个文件组成，为了不看花眼大家通常会通过文件夹容纳一个页面，而 mpx 单文件则没有这个文件，可以愉快地去掉一层）

在 pages 文件夹下创建 index.mpx 文件，复制原本的四个文件到 index.mpx 的四个域下。（[原四个文件](./src/pages/index) VS [index.mpx](./src/pages/index.mpx)）

修改标题，修改一下 logo，修改一下 json 里的 title 配置，本示例到此结束。

PS：真正的 application 此处就该从@mpxjs/core 中引入 createPage \ createComponent 等方法，开始体验 mpx 带来的更爽的开发体验了。
