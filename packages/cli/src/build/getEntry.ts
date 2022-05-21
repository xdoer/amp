import fs from 'fs'
import { resolve } from 'path'

function isTsProject() {
  return fs.existsSync(resolve('tsconfig.json'))
}

export default function getEntry(dir, ext?: string) {
  return resolve(dir, `app.${ext || (isTsProject() ? 'ts' : 'js')}`)
}
