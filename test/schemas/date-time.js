const DateTime = {
  'id': 'DateTime',
  'type': 'object',
  'properties': {
    'date': {
      'type': 'string',
      'format': 'date'
    },
    'time': {
      'type': 'string',
      'format': 'time'
    },
    'date_time': {
      'type': 'string',
      'format': 'date-time'
    },
  }
}

export default DateTime
