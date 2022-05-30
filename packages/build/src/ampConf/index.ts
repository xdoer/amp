import { resolve } from 'path'
import { ampConf } from './default'
import { AmpConf } from '../types'
import { merge } from '../utils'

function getAmpConf() {
  let userAmpConf = {}
  try {
    userAmpConf = require(resolve('amp.config.js'))
  } catch (e) { }
  return userAmpConf
}

export { platformConf } from './default'

export function parseAmpConf(): AmpConf {
  return merge(ampConf, getAmpConf())
}
