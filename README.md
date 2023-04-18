# @begin/validator

[![NPM version](https://img.shields.io/npm/v/@begin/validator.svg?style=flat)](https://www.npmjs.com/package/@begin/validator)
[![GitHub CI status](https://github.com/beginner-corp/validator/workflows/Node%20CI/badge.svg)](https://github.com/beginner-corp/validator/actions?query=workflow%3A%22Node+CI%22)

Validate request bodies against a provided [JSON Schema](https://json-schema.org/). `Content-type`'s supported included `application/json` and `application/x-www-form-urlencoded`. JSON request bodies are validated directly against the schema while form encoded bodies are coerced into schema format.

## Contributing & bugs

Please fork the repository, make the changes in your fork and include tests. Once you're done making changes, send in a pull request.

### Bug reports

Please include a test which shows why the code fails.

## Installation

```
npm i @begin/validator
```

## Usage

```javascript
import arc from '@architect/functions'
import validator from '@begin/validator'

const Book = {
    id: 'Book',
    type: 'object',
    properties: {
        title: { type: 'string' },
        author: { type: 'string' },
        publication_date: { type: 'integer' },
        ID: { type: 'string' }
    }
}

export const handler = arc.http.async(validate)

async function validate(request) {
    let res = validator(request, Book)
    if (!res.valid) {
        return {
            statusCode: 500,
            json: { error: res.errors.map(e => e.stack).join('\n') }
        }
    }
    // Data is valid!
}
```

## Normalization of form data into JavaScript Objects
Data is passed from forms as a list of key value pairs of strings.
When submitted to the server or passed to client side JavaScript these key value pairs must be converted into an Object.
This package will normalize data by:
- Converting key/value pairs into nested objects (i.e. `'user.addr[0].name'` -> {user:addr:[{name:'Jane'}]})
- Changing string values into integer or float based on Schema.
- Changing boolean values into booleans based on Schema

### Nested objects and arrays form keys
- . (dots) expand into objects (i.e. `'user.addr'` -> `{user:addr:'value'}`)
- [1] Bracket notation converts to arrays with order. Missing indexes are squashed.
- [] Empty brackets convert to arrays, but can only be used at the end of keys. (i.e. `'foo[]'`, not `'bar[].something'`)

### Normalization of types
Forms return all values as strings. Including boolean and number values.
In addition false booleans (i.e. radio button not checked) will not be included in the submitted form data.
If a schema is used these types (and missing booleans) are coerced into the expected types.

```javascript
  const formValues = {
    'anInteger': '3',
    'aFloat': '3.1',
    'aBooleanTrue': 'on'
    // 'aRadioFalse':'' // false boolean won't show up in form output
  }

  const Schema = {
    'id': 'ComplexSchema',
    'type': 'object',
    'properties': {
      'aFloat': { 'type': 'number' },
      'anInteger': { 'type': 'integer' },
      'aBooleanTrue': { 'type': 'boolean' },
      'aBooleanFalse': { 'type': 'boolean' },
    }
  }

  console.log(formEncodingToSchema(formValues, Schema))
  // { aBooleanTrue: true, aBooleanFalse: false, anInteger: 3, aFloat: 3.1 }
```

This normalization works for objects submitted to the server and FormData objects on the client.
Architect (and many other servers) will automatically parse the form encoded string on the server into a flat object.
If there are any duplicated key/values they are passed into an array.

```html
<input name=bar value=one/>
<input name=bar value=two/>
<input name=bar value=three/>
```
```javascript
// Shows up as an array
export default post(req){
  console.log(req.body)
  // ['one','two','three']
}
```

On the client using FormData these duplicated keys are put into an iterable object without forming array.
```html
<form>
  <input name=bar value=one/>
  <input name=bar value=two/>
  <input name=bar value=three/>
</form>
<script>
  const form = document.querySelector('form')
  const fromData = new FormData(form)
  console.log(Object.entries(formData))
  // {bar:"three"}
  console.log(formData.getAll('bar'))
  // ['one','two','three']
</script>

```
Converting this object into entries will only get one of the duplicate keys. 
Using the `getAll` method will get the array.

## Duplicate Keys
Duplicate key names can create ambiguity parsing the output. 
Bracket notation `bar[]` is recommended to disambiguate the duplicates when using for clientside FormData objects.
Alternatively you can declare the key as duplicated in the configuration (i.e. `convertToNestedObject(formData,{duplicateKeys:['bar']})`).

The following is an example with a complex object.
```javascript
  const formValuesServer = {
    'foo[0]': 'one',
    'foo[1]': 'two',
    'foo[2]': 'three',
    'zoo[]': [ 'one', 'two', 'three' ],
    // repeated keys create an array
    'bar': [ 'one', 'two', 'three' ],
    // missing indexes
    'baz[0]': 'one',
    'baz[3]': 'three',
    'baz[4]': 'four',
    'user.addr[0].firstname': 'john',
    'user.addr[0].lastname': 'smith',
    'user.addr[1].firstname': 'jane',
    'user.addr[1].lastname': 'doe',
    'user.thing[0][0].person': 'something',
    'anInteger': '3',
    'aFloat': '3.1',
    'aBooleanTrue': 'on'
    // 'aRadioFalse':'' // false boolean won't show up in form output
  }

  const formData = new FormData()
  formData.append( 'foo[0]', 'one')
  formData.append( 'foo[1]', 'two')
  formData.append( 'foo[2]', 'three')
  formData.append( 'zoo[]', 'one')
  formData.append( 'zoo[]', 'two')
  formData.append( 'zoo[]', 'three')
  formData.append( 'bar', 'one')
  formData.append( 'bar', 'two')
  formData.append( 'bar', 'three')
  formData.append( 'baz[0]', 'one')
  formData.append( 'baz[3]', 'three')
  formData.append( 'baz[4]', 'four')
  formData.append( 'user.addr[0].firstname', 'john')
  formData.append( 'user.addr[0].lastname', 'smith')
  formData.append( 'user.addr[1].firstname', 'jane')
  formData.append( 'user.addr[1].lastname', 'doe')
  formData.append( 'user.thing[0][0].person', 'something')
  formData.append( 'anInteger', '3')
  formData.append( 'aFloat', '3.1')
  formData.append( 'aBooleanTrue', 'on')

  const ComplexSchema = {
    'id': 'ComplexSchema',
    'type': 'object',
    'properties': {
      'aFloat': { 'type': 'number' },
      'anInteger': { 'type': 'integer' },
      'aBooleanTrue': { 'type': 'boolean' },
      'aBooleanFalse': { 'type': 'boolean' },
    }
  }

  const javascriptObject = {
    foo: [ 'one', 'two', 'three' ],
    zoo: [ 'one', 'two', 'three' ],
    bar: [ 'one', 'two', 'three' ],
    baz: [ 'one', 'three', 'four' ],
    user: {
      addr: [
        { firstname: 'john', lastname: 'smith' },
        { firstname: 'jane', lastname: 'doe' }
      ],
      thing: [
        [ { person: 'something' } ]
      ]
    },
    aBooleanTrue: true,
    aBooleanFalse: false,
    anInteger: 3,
    aFloat: 3.1,
  }
  const resultFromObject = formEncodingToSchema(convertToNestedObject(formValues), ComplexSchema)
  const resultFromIterable = formEncodingToSchema(convertToNestedObject(formData, { duplicateKeys: [ 'bar' ] }), ComplexSchema)
```


