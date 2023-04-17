import { test } from 'tape'
import { FormData } from 'formdata-node'
import convertToNestedObject from '../src/convert-to-nested-object.js'
import formEncodingToSchema from '../src/form-encoding-to-schema.js'


test('Normalizing a complex form', async t => {
  t.plan(2)

  const formValues = {
    'foo[0]': 'one',
    'foo[1]': 'two',
    'foo[2]': 'three',
    'zoo[]': [ 'one', 'two', 'three' ],
    'bar': [ 'one', 'two', 'three' ],
    // baz indexes 1 and 2 undefined
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
  t.deepEqual(resultFromObject, javascriptObject, 'complex object normalized')
  const resultFromIterable = formEncodingToSchema(convertToNestedObject(formData, { duplicateKeys: [ 'bar' ] }), ComplexSchema)
  t.deepEqual(resultFromIterable, javascriptObject, 'complex object normalized from iterable FormData')
})


test('dup keys with array label in object', async t => {
  t.plan(1)

  const formValues = {
    'zoo[]': [ 'one', 'two', 'three' ],
    'goo[1].bar[]': [ '1', '2', '3' ],

  }

  const javascriptObject = {
    zoo: [ 'one', 'two', 'three' ],
    goo: [ { bar: [ '1', '2', '3' ] } ],
  }
  const resultFromObject = convertToNestedObject(formValues)
  t.deepEqual(resultFromObject, javascriptObject, 'dup keys with [] in object' )
})


test('dup keys with array label for iterable FormData', async t => {
  t.plan(1)

  const formData = new FormData()
  formData.append( 'zoo[]', 'one')
  formData.append( 'zoo[]', 'two')
  formData.append( 'zoo[]', 'three')
  formData.append( 'foo[1].bar[]', '1')
  formData.append( 'foo[1].bar[]', '2')
  formData.append( 'foo[1].bar[]', '3')
  formData.append( 'goo[].bar[1]', '1')
  formData.append( 'goo[].bar[1]', '2')
  formData.append( 'goo[].bar[1]', '3')


  const javascriptObject = {
    zoo: [ 'one', 'two', 'three' ],
    foo: [ { bar: [ '1', '2', '3' ] } ],
    goo: [ { bar: [ '1' ] }, { bar: [ '2' ] }, { bar: [ '3' ] } ]
  }
  const resultFromIterable = convertToNestedObject(formData)
  t.deepEqual(resultFromIterable, javascriptObject, 'dup key with [] in iterable FormData')
})



test('dup keys in object', async t => {
  t.plan(1)

  const formValues = {
    'bar': [ '1', '2', '3' ],
  }

  const javascriptObject = {
    bar: [ '1', '2', '3' ],
  }
  const resultFromObject = convertToNestedObject(formValues )
  t.deepEqual(resultFromObject, javascriptObject, 'dup keys in object' )
})

test('dup keys in iterable FormData', async t => {
  t.plan(1)

  const formData = new FormData()
  formData.append( 'bar', '1')
  formData.append( 'bar', '2')
  formData.append( 'bar', '3')

  const javascriptObject = {
    bar: [ '1', '2', '3' ],
  }
  const resultFromIterable = convertToNestedObject(formData, { duplicateKeys: [ 'bar' ] })
  t.deepEqual(resultFromIterable, javascriptObject, 'dup key in iterable FormData')
})


test('Integer Parsed', async t => {
  t.plan(1)

  const formValues = {
    'anInteger': '3',
  }

  const javascriptObject = {
    anInteger: 3
  }

  const Complex = {
    'id': 'Complex',
    'type': 'object',
    'properties': {
      'anInteger': { 'type': 'integer' },
    }
  }


  const result = formEncodingToSchema(convertToNestedObject(formValues), Complex)
  t.deepEqual(result, javascriptObject, 'integer parsed')


})

test('Float Parsed', async t => {
  t.plan(1)

  const formValues = {
    'aFloat': '3.1',
  }

  const javascriptObject = {
    aFloat: 3.1
  }

  const Complex = {
    'id': 'Complex',
    'type': 'object',
    'properties': {
      'aFloat': { 'type': 'number' },
    }
  }


  const result = formEncodingToSchema(convertToNestedObject(formValues), Complex)
  t.deepEqual(result, javascriptObject, 'float parsed')


})

test('Boolean values', async t => {
  t.plan(1)

  const formValues = {
    'aBooleanTrue': 'on'
    // 'aRadioFalse':'' // false boolean won't show up in form output
  }

  const javascriptObject = {
    aBooleanTrue: true,
    aBooleanFalse: false
  }

  const Complex = {
    'id': 'Complex',
    'type': 'object',
    'properties': {
      'aBooleanTrue': { 'type': 'boolean' },
      'aBooleanFalse': { 'type': 'boolean' },
    }
  }


  const result = formEncodingToSchema(convertToNestedObject(formValues), Complex)
  t.deepEqual(result, javascriptObject, 'boolean parsed')


})

