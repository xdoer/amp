import parseRequest from './parse-request'
import stringifyQuery from './stringify-query'
import eleType from './type'

// 默认为非强行覆盖原query，如需强行覆盖传递force为true
export default function addQuery(request, data = {}, force?: boolean, removeKeys?: string | string[]) {
  const { rawResourcePath: resourcePath, loaderString, queryObj: queryObjRaw } = parseRequest(request)
  const queryObj = Object.assign({}, queryObjRaw)
  if (force) {
    Object.assign(queryObj, data)
  } else {
    Object.keys(data).forEach((key) => {
      if (!queryObj.hasOwnProperty(key)) {
        queryObj[key] = data[key]
      }
    })
  }

  if (removeKeys) {
    if (eleType(removeKeys) === 'String') {
      removeKeys = [removeKeys as string]
    }
    (removeKeys as string[]).forEach((key) => {
      delete queryObj[key]
    })
  }

  return (loaderString ? `${loaderString}!` : '') + resourcePath + stringifyQuery(queryObj)
}
