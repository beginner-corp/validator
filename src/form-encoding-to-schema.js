export default function formEncodingToSchema (obj, schema) {
  Object.keys(schema.properties).forEach(prop => {
    let type = schema.properties[prop]?.type
    if (type === 'integer' || type === 'number') {
      obj[prop] = parseInt(obj[prop])
    }
    else if (type === 'boolean') {
      obj[prop] = obj[prop] === 'on' ? true : false
    }
    else if (type === 'object') {
      obj[prop] = {}
      Object.keys(schema.properties[prop]?.properties).forEach(innerProp => {
        obj[prop][innerProp] = obj[innerProp]
        delete obj[innerProp]
      })
    }
  })
  return obj
}
