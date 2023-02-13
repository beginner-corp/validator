export default function formEncodingToSchema (obj, schema) {
  Object.keys(schema.properties).forEach(prop => {
    let type = schema.properties[prop]?.type
    if (type === 'integer' || type === 'number') {
      if (obj[prop]) {
        obj[prop] = parseInt(obj[prop])
      }
      else {
        delete obj[prop]
      }
    }
    else if (type === 'string') {
      let format = schema.properties[prop]?.format
      if ((format === 'time' || format === 'date-time')
        && obj[prop].match(/:/g).length === 1) {
        obj[prop] = `${obj[prop]}:00`
      }
    }
    else if (type === 'boolean') {
      obj[prop] = obj[prop] === 'on' || obj[prop] === true ? true : false
    }
    else if (type === 'object') {
      if (obj[prop]) {
        let temp = formEncodingToSchema(obj[prop], schema.properties[prop])
        if (temp) {
          obj[prop] = temp
        }
      }
    }
  })
  return obj
}
