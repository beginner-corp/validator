import { test } from 'tape'
import convertToNestedObject from '../src/convert-to-nested-object.js'
import formEncodingToSchema from '../src/form-encoding-to-schema.js'

import Book from './schemas/book.js'
import Person from './schemas/person.js'
import DateTime from './schemas/date-time.js'

test('formEncodingToSchema - Book schema', async t => {
  t.plan(4)

  let obj = convertToNestedObject({
    title: 'Modern Software Engineering',
    author: 'Dave Farley',
    publication_date: '2021'
  })
  t.deepEqual(formEncodingToSchema(obj, Book), {
    title: 'Modern Software Engineering',
    author: 'Dave Farley',
    publication_date: 2021
  }, 'all props strings')

  obj = convertToNestedObject({
    title: 'Modern Software Engineering',
    author: 'Dave Farley',
    publication_date: 2021
  })
  t.deepEqual(formEncodingToSchema(obj, Book), {
    title: 'Modern Software Engineering',
    author: 'Dave Farley',
    publication_date: 2021
  }, 'one integer prop')

  obj = convertToNestedObject({
    title: 'Modern Software Engineering',
    publication_date: '2021'
  })
  t.deepEqual(formEncodingToSchema(obj, Book), {
    title: 'Modern Software Engineering',
    publication_date: 2021
  }, 'no author')

  obj = convertToNestedObject({
    title: 'Modern Software Engineering',
    author: 'Dave Farley',
    publication_date: ''
  })
  t.deepEqual(formEncodingToSchema(obj, Book), {
    title: 'Modern Software Engineering',
    author: 'Dave Farley'
  }, 'integer is empty string')

})

test('formEncodingToSchema - Person schema', async t => {
  t.plan(5)

  let obj = convertToNestedObject({
    firstName: 'Guy',
    lastName: 'Incognito',
    age: '20',
    gender: 'Male',
    height: '12',
    dateOfBirth: '2022-06-22',
    rating: '1',
    committer: 'false',
  })
  t.deepEqual(formEncodingToSchema(obj, Person), {
    firstName: 'Guy',
    lastName: 'Incognito',
    age: 20,
    gender: 'Male',
    height: 12,
    dateOfBirth: '2022-06-22',
    rating: 1,
    committer: false,
  }, 'all props strings')

  obj = convertToNestedObject({
    firstName: 'Guy',
    lastName: 'Incognito',
    age: '20',
    gender: 'Male',
    height: '12',
    dateOfBirth: '2022-06-22',
    rating: '1',
    committer: 'false',
    'address.city': 'Nowhere',
    'address.postalCode': '90210',
    'address.street': 'Bayside Cres.',
    'address.streetnumber': '70',
  })
  t.deepEqual(formEncodingToSchema(obj, Person), {
    firstName: 'Guy',
    lastName: 'Incognito',
    age: 20,
    gender: 'Male',
    height: 12,
    dateOfBirth: '2022-06-22',
    rating: 1,
    committer: false,
    address: {
      city: 'Nowhere',
      postalCode: '90210',
      street: 'Bayside Cres.',
      streetnumber: 70,
      permanent: false,
    }
  }, 'sub object strings')

  obj = convertToNestedObject({
    firstName: 'Guy',
    lastName: 'Incognito',
    age: 20,
    gender: 'Male',
    height: 12,
    dateOfBirth: '2022-06-22',
    rating: 1,
    committer: 'false',
  })
  t.deepEqual(formEncodingToSchema(obj, Person), {
    firstName: 'Guy',
    lastName: 'Incognito',
    age: 20,
    gender: 'Male',
    height: 12,
    dateOfBirth: '2022-06-22',
    rating: 1,
    committer: false,
  }, 'some integer props')

  obj = convertToNestedObject({
    firstName: 'Guy',
    lastName: 'Incognito',
    age: 20,
    gender: 'Male',
    height: 12,
    dateOfBirth: '2022-06-22',
    rating: 1,
    committer: false,
  })
  t.deepEqual(formEncodingToSchema(obj, Person), {
    firstName: 'Guy',
    lastName: 'Incognito',
    age: 20,
    gender: 'Male',
    height: 12,
    dateOfBirth: '2022-06-22',
    rating: 1,
    committer: false,
  }, 'false boolean props')

  obj = convertToNestedObject({
    firstName: 'Guy',
    lastName: 'Incognito',
    age: 20,
    gender: 'Male',
    height: 12,
    dateOfBirth: '2022-06-22',
    rating: 1,
    committer: true,
  })
  t.deepEqual(formEncodingToSchema(obj, Person), {
    firstName: 'Guy',
    lastName: 'Incognito',
    age: 20,
    gender: 'Male',
    height: 12,
    dateOfBirth: '2022-06-22',
    rating: 1,
    committer: true,
  }, 'true boolean props')

})


test('formEncodingToSchema - DateTime schema', async t => {
  t.plan(2)

  let obj = convertToNestedObject({
    date: '2022-09-02',
    time: '10:00:00',
    date_time: '2022-09-02T10:00:00'
  })
  t.deepEqual(formEncodingToSchema(obj, DateTime), {
    date: '2022-09-02',
    time: '10:00:00',
    date_time: '2022-09-02T10:00:00'
  }, 'all props correct')

  obj = convertToNestedObject({
    date: '2022-09-02',
    time: '10:00',
    date_time: '2022-09-02T10:00'
  })
  t.deepEqual(formEncodingToSchema(obj, DateTime), {
    date: '2022-09-02',
    time: '10:00:00',
    date_time: '2022-09-02T10:00:00'
  }, 'missing seconds')

  /*
  obj = convertToNestedObject({
    title: 'Modern Software Engineering',
    publication_date: '2021'
  })
  t.deepEqual(formEncodingToSchema(obj, Book), {
    title: 'Modern Software Engineering',
    publication_date: 2021
  }, 'no author')

  obj = convertToNestedObject({
    title: 'Modern Software Engineering',
    author: 'Dave Farley',
    publication_date: ''
  })
  t.deepEqual(formEncodingToSchema(obj, Book), {
    title: 'Modern Software Engineering',
    author: 'Dave Farley'
  }, 'integer is empty string')
*/
})
