import startPack from '@amp/build'
import cmd from './parseCommand'

function main() {
  console.log('查看配置信息', cmd())
  startPack(cmd())
}

main()
