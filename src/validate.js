import { Validator } from 'jsonschema'
import isJSON from './is-json.js'
import formEncodingToSchema from './form-encoding-to-schema.js'
import convertToNestedObject from './convert-to-nested-object.js'

export default function validator (request, schema) {
  let data = request.body
  if (!isJSON(request)) {
    let obj = convertToNestedObject(data)
    data = formEncodingToSchema(obj, schema)
  }
  const v = new Validator()
  return { res: v.validate(data, schema), data }
}
