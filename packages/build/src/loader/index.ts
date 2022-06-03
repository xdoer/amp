export const normalizeLoader = (name) => {
  return require.resolve(`@amp/build/lib/loader/${name}`)
}

export const jsonLoader = normalizeLoader('json-loader')

export const xmlLoader = normalizeLoader('xml-loader')

export const fileLoader = normalizeLoader('file-loader')
