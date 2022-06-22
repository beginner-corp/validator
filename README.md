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



