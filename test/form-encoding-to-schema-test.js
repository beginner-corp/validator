import { test } from 'tape'
import convertToSchema from '../src/convert-to-schema.js'
import formEncodingToSchema from '../src/form-encoding-to-schema.js'

import Book from './schemas/book.js'
import Person from './schemas/person.js'

test('formEncodingToSchema - Book schema', async t => {
  t.plan(4)

  let obj = convertToSchema({
    title: 'Modern Software Engineering',
    author: 'Dave Farley',
    publication_date: '2021'
  })
  t.deepEqual(formEncodingToSchema(obj, Book), {
    title: 'Modern Software Engineering',
    author: 'Dave Farley',
    publication_date: 2021
  }, 'all props strings')

  obj = convertToSchema({
    title: 'Modern Software Engineering',
    author: 'Dave Farley',
    publication_date: 2021
  })
  t.deepEqual(formEncodingToSchema(obj, Book), {
    title: 'Modern Software Engineering',
    author: 'Dave Farley',
    publication_date: 2021
  }, 'one integer prop')

  obj = convertToSchema({
    title: 'Modern Software Engineering',
    publication_date: '2021'
  })
  t.deepEqual(formEncodingToSchema(obj, Book), {
    title: 'Modern Software Engineering',
    publication_date: 2021
  }, 'no author')

  obj = convertToSchema({
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

  let obj = convertToSchema({
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

  obj = convertToSchema({
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
      streetnumber: '70',
    }
  }, 'sub object strings')

  obj = convertToSchema({
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

  obj = convertToSchema({
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

  obj = convertToSchema({
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
