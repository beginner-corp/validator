import { test } from 'tape'
import validator from '../src/validate.js'

import Book from './schemas/book.js'

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
