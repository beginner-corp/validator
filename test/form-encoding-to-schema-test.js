import { test } from 'tape'
import formEncodingToSchema from '../src/form-encoding-to-schema.js'

import Book from './schemas/book.js'
import Person from './schemas/person.js'

test('formEncodingToSchema - Book schema', async t => {
  t.plan(3)

  t.deepEqual(formEncodingToSchema({
    title: 'Modern Software Engineering',
    author: 'Dave Farley',
    publication_date: '2021'
  }, Book), {
    title: 'Modern Software Engineering',
    author: 'Dave Farley',
    publication_date: 2021
  }, 'all props strings')

  t.deepEqual(formEncodingToSchema({
    title: 'Modern Software Engineering',
    author: 'Dave Farley',
    publication_date: 2021
  }, Book), {
    title: 'Modern Software Engineering',
    author: 'Dave Farley',
    publication_date: 2021
  }, 'one integer prop')

  t.deepEqual(formEncodingToSchema({
    title: 'Modern Software Engineering',
    publication_date: '2021'
  }, Book), {
    title: 'Modern Software Engineering',
    publication_date: 2021
  }, 'no author')

})

test('formEncodingToSchema - Person schema', async t => {
  t.plan(5)

  t.deepEqual(formEncodingToSchema({
    firstName: 'Guy',
    lastName: 'Incognito',
    age: '20',
    gender: 'Male',
    height: '12',
    dateOfBirth: '2022-06-22',
    rating: '1',
    committer: 'false',
  }, Person), {
    firstName: 'Guy',
    lastName: 'Incognito',
    age: 20,
    gender: 'Male',
    height: 12,
    dateOfBirth: '2022-06-22',
    rating: 1,
    committer: false,
    address: {
      city: '',
      postalCode: '',
      street: '',
      streetnumber: '',
    }
  }, 'all props strings')

  t.deepEqual(formEncodingToSchema({
    firstName: 'Guy',
    lastName: 'Incognito',
    age: '20',
    gender: 'Male',
    height: '12',
    dateOfBirth: '2022-06-22',
    rating: '1',
    committer: 'false',
    city: 'Nowhere',
    postalCode: '90210',
    street: 'Bayside Cres.',
    streetnumber: '70',
  }, Person), {
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

  t.deepEqual(formEncodingToSchema({
    firstName: 'Guy',
    lastName: 'Incognito',
    age: 20,
    gender: 'Male',
    height: 12,
    dateOfBirth: '2022-06-22',
    rating: 1,
    committer: 'false',
  }, Person), {
    firstName: 'Guy',
    lastName: 'Incognito',
    age: 20,
    gender: 'Male',
    height: 12,
    dateOfBirth: '2022-06-22',
    rating: 1,
    committer: false,
    address: {
      city: '',
      postalCode: '',
      street: '',
      streetnumber: '',
    }
  }, 'some integer props')

  t.deepEqual(formEncodingToSchema({
    firstName: 'Guy',
    lastName: 'Incognito',
    age: 20,
    gender: 'Male',
    height: 12,
    dateOfBirth: '2022-06-22',
    rating: 1,
    committer: false,
  }, Person), {
    firstName: 'Guy',
    lastName: 'Incognito',
    age: 20,
    gender: 'Male',
    height: 12,
    dateOfBirth: '2022-06-22',
    rating: 1,
    committer: false,
    address: {
      city: '',
      postalCode: '',
      street: '',
      streetnumber: '',
    }
  }, 'false boolean props')

  t.deepEqual(formEncodingToSchema({
    firstName: 'Guy',
    lastName: 'Incognito',
    age: 20,
    gender: 'Male',
    height: 12,
    dateOfBirth: '2022-06-22',
    rating: 1,
    committer: true,
  }, Person), {
    firstName: 'Guy',
    lastName: 'Incognito',
    age: 20,
    gender: 'Male',
    height: 12,
    dateOfBirth: '2022-06-22',
    rating: 1,
    committer: true,
    address: {
      city: '',
      postalCode: '',
      street: '',
      streetnumber: '',
    }
  }, 'true boolean props')

})
