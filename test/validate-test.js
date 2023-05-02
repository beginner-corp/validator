import { test } from 'tape'
import validator from '../src/validate.js'

import Book from './schemas/book.js'
import Person from './schemas/person.js'

test('isValid', async t => {
  t.plan(2)

  let result = validator({
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      title: 'Modern Software Engineering',
      author: 'Dave Farley',
      publication_date: 2021
    }
  }, Book)
  t.equal(result.valid, true, 'valid input')

  result = validator({
    headers: {
      'Content-Type': 'application/x-url-form-encoding'
    },
    body: {
      title: 'Modern Software Engineering',
      author: 'Dave Farley',
      publication_date: 'not a year'
    }
  }, Book)
  t.equal(result.valid, false, 'invalid input')
})

test('problems given', async t => {
  t.plan(1)
  let result = validator({
    headers: {
      'Content-Type': 'application/x-url-form-encoding'
    },
    body: {
      title: 'Modern Software Engineering',
      author: 'Dave Farley',
      publication_date: 'not a year'
    }
  }, Book)
  const problems = {
    publication_date: { errors: [ 'is not of a type(s) integer' ] }
  }
  t.deepEquals(result?.problems, problems, 'problems given')

})

test('isValid with boolean', async t => {
  t.plan(2)

  let result = validator({
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      firstname: 'Dave',
      lastname: 'Farley',
      age: 50,
      committer: true
    }
  }, Person)
  t.equal(result.valid, true, 'valid JSON input')

  result = validator({
    headers: {
      'Content-Type': 'application/x-url-form-encoding'
    },
    body: {
      firstname: 'Dave',
      lastname: 'Farley',
      age: 50,
      committer: true
    }
  }, Book)
  t.equal(result.valid, true, 'valid URL encoded input')

})

test('isValid, FormData with checkbox', async t => {
  t.plan(8)

  let result = validator({
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      firstname: 'Dave',
      lastname: 'Farley',
      age: 50,
      committer: 'on'
    }
  }, Person)
  t.equal(result.valid, true, 'FormData with checkbox checked')
  t.equal(result.data.committer, true, 'Checked checkbox is true')

  result = validator({
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      firstname: 'Dave',
      lastname: 'Farley',
      age: 50,
      committer: 'true'
    }
  }, Person)
  t.equal(result.valid, true, 'FormData with checkbox set to string "true"')
  t.equal(result.data.committer, false, 'Any string value not equal to "on" is false even if it is "true"')

  result = validator({
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      firstname: 'Dave',
      lastname: 'Farley',
      age: 50,
      committer: 'off'
    }
  }, Person)
  t.equal(result.valid, true, 'FormData with checkbox unchecked')
  t.equal(result.data.committer, false, 'Any string value not equal to "on" is false')

  result = validator({
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      firstname: 'Dave',
      lastname: 'Farley',
      age: 50
    }
  }, Book)
  t.equal(result.valid, true, 'FormData without checkbox')
  t.equal(result.data.committer, undefined, 'No value is undefined')

})


test('isValid, FormData with checkbox', async t => {
  t.plan(6)

  let result = validator({
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      firstname: 'Dave',
      lastname: 'Farley',
      age: 50,
      committer: 'on',
      'address.street': 'Piccadilly',
      'address.streetnumber': '1',
      'address.postalCode': 'L0D0N',
      'address.city': 'London',
      'address.permanent': 'on'
    }
  }, Person)

  t.equal(result.valid, true, 'FormData with nested object is valid')
  t.equal(result.data.address.street, 'Piccadilly', 'Nested object string is valid')
  t.equal(result.data.address.streetnumber, 1, 'Nested object string is valid')
  t.equal(result.data.address.postalCode, 'L0D0N', 'Nested object string is valid')
  t.equal(result.data.address.city, 'London', 'Nested object string is valid')
  t.equal(result.data.address.permanent, true, 'Nested object boolean is valid')

})
