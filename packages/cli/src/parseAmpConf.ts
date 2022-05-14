import { resolve } from './utils'

function getAmpConfig() {
  return require(resolve('amp.config.js'))
}

export default function resolveAmpConfig() {
  return getAmpConfig()
}
