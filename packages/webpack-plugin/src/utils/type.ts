export default function (n) {
  return Object.prototype.toString.call(n).slice(8, -1)
}
