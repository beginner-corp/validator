/* eslint-disable filenames/match-regex */
import { test } from 'tape'
import isJSON from '../src/is-json.js'

test('isJson', async t => {
  t.plan(5)

  t.equal(isJSON({
    headers: {
      'Content-Type': 'application/json'
    }
  }), true, 'content type capitalized')
  t.equal(isJSON({
    headers: {
      'content-type': 'application/json'
    }
  }), true, 'content type lower case')
  t.equal(isJSON({
    headers: {
      'Accept': 'application/json'
    }
  }), true, 'accept type capitalized')
  t.equal(isJSON({
    headers: {
      'accept': 'application/json'
    }
  }), true, 'accept type lower case')
  t.equal(isJSON({
    headers: {
      'content-type': 'text/plain'
    }
  }), false, 'Not JSON')

})
