import { Validator } from 'jsonschema'
import isJSON from './is-json.js'
import formEncodingToSchema from './form-encoding-to-schema.js'

export default function validator (request, schema) {
  const obj = isJSON(request) ? request.body : formEncodingToSchema(request.body, schema)
  const v = new Validator()
  return v.validate(obj, schema)
}
