import fs from 'fs'
import { resolve } from './utils'

function isTsProject() {
  return fs.existsSync(resolve('tsconfig.json'))
}

export default function getEntry(dir) {
  return resolve(dir, `app.${isTsProject() ? 'ts' : 'js'}`)
}
