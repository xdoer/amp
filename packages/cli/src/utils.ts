import path from 'path'

export function resolve(...dirs) {
  return path.resolve(process.cwd(), ...dirs)
}
