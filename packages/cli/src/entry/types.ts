export interface Entry {
  type: EntryType // 入口类型
  pkg: string // 预留分包名称，为体积优化留坑位
  loc: string // 当前文件位置
  name: string // 名称
  key: string  // 组件 key
  value: string // 组件 value
  output: string  // 输出位置
  caller: string  // 调用方
}

export enum EntryType {
  page = 'page',
  comp = 'component'
}
