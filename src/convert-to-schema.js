function isObject (arg) {
  return arg && typeof arg === 'object'
}

function convertExtend (arr, obj) {
  if (!isObject(obj)) {
    obj = {}
  }

  let str = arr[0],
    last = obj,
    props,
    valProp

  if (typeof str === 'string') {
    props = str.split('.')
    valProp = props.pop()
    props.reduce(function (nest, prop) {
      prop = prop.trim()
      last = nest[prop]
      if (!isObject(last)) {
        nest[prop] = last = {}
      }
      return last
    }, obj)
    last[valProp] = arr[1]
  }
  return obj
}

export default function convertToSchema (data) {
  let obj = {}
  console.log(data)
  let entries = Object.entries(data)
  entries.forEach(entry => convertExtend(entry, obj))
  return obj
}
