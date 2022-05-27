import { resolve } from 'path'
import { ampConf } from './ampConf'
import { AmpConf } from './types'
import { merge } from './utils'

function getAmpConfig() {
  let userAmpConf = {}
  try {
    userAmpConf = require(resolve('amp.config.js'))
  } catch (e) { }
  return userAmpConf
}

export default function resolveAmpConfig(): AmpConf {
  return merge(ampConf, getAmpConfig())
}
