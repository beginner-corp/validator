import { Validator } from 'jsonschema'
import isJSON from './is-json.js'
import formEncodingToSchema from './form-encoding-to-schema.js'
import convertToNestedObject from './convert-to-nested-object.js'

export default function validator (request, schema) {
  let data = request.body

  // If the request Content-Type !== application/json we need to convert from
  // a list of properties to an object.
  if (!isJSON(request)) {
    let obj = convertToNestedObject(data)
    data = formEncodingToSchema(obj, schema)
  }
  else {
    data = formEncodingToSchema(data, schema)
  }

  // Run validator
  const v = new Validator()
  const res = v.validate(data, schema)

  // Convert error list into problems object
  let problems = []
  if (!res.valid) {
    res.errors.forEach(e => {
      let key = e.property === 'instance' ? e.argument : e.property.replace(/instance./, '')
      let msg = e.message.replace(/"/g, '')
      if (problems[key]) {
        problems[key].errors.push(msg)
      }
      else {
        problems[key] = { errors: [ msg ] }
      }
    })
  }
  return { valid: res.valid, problems: convertToNestedObject(problems), data }
}
