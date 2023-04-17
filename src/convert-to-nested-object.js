// eslint-disable-next-line fp/no-class
class DuplicateKeyError extends Error {
  constructor (key) {
    super(`Duplicate key at path part ${key}`)
    this.key = key
  }
}
// eslint-disable-next-line fp/no-class
class MixedArrayError extends Error {
  constructor (key) {
    super(`Mixed array at path part ${key}`)
    this.key = key
  }
}

function isJsonObject (val) {
  return (
    typeof val === 'object' &&
    !Array.isArray(val) &&
    val !== null
  )
}

// removes trailing [] for objects where the array is already constructed
function fixArrayNotationForPlainObjects (entry, isIterable){
  if (Array.isArray(entry.value) && /\[]$/.test(entry.path) && !isIterable) {
    return { path: entry.path.replace(/\[]$/, ''), value: entry.value }
  }
  return entry
}

// for iterable objects like FormData this adds the [] inticator at the end of duplicate key
function allowDuplicatesInIterables (entry, isIterable, keys){
  const key = keys.find(k => k === entry.path)
  if (key && isIterable){
    return { path: `${key}[]`, value: entry.value }
  }
  return entry
}

function extractPathParts (path) {
  const re = /((\d*)\]|([^.[]+))([\[\.]|$)/g

  return Array.from(path.matchAll(re)).map(match => {
    const array = match[2]
    const pathPart = match[3]
    const nextType = match[4]
    const type = array === undefined ? 'object' : 'array'
    const nextDefault = nextType === '[' ? [] : {}
    return {
      path: array ?? pathPart,
      type,
      default: nextDefault,
      pathToPart: path.slice(0, match.index + match[1].length),
    }
  })
}


function handlePathPart (
  pathPart,
  currentPathObject,
  arraysWithOrder,
) {
  if (pathPart.type === 'object') {
    if (Array.isArray(currentPathObject)) {
      throw new DuplicateKeyError(pathPart.pathToPart)
    }
    const currentObject = currentPathObject
    return [
      currentObject[pathPart.path],
      val => (currentObject[pathPart.path] = val),
    ]
  }
  if (!Array.isArray(currentPathObject)) {
    throw new DuplicateKeyError(pathPart.pathToPart)
  }
  const currentArray = currentPathObject
  const isOrdered = pathPart.path !== ''

  const isOrderedArray = arraysWithOrder.has(currentArray)
  if (isOrdered) {
    arraysWithOrder.add(currentArray)
  }
  if (
    (!isOrdered && isOrderedArray) ||
    (isOrdered && !isOrderedArray && currentArray.length > 0)
  ) {
    throw new MixedArrayError(pathPart.pathToPart)
  }

  const order = isOrdered ? Number(pathPart.path) : currentArray.length
  return [ currentArray[order], val => (currentArray[order] = val) ]
}

export default function parseFormData ( formData, { removeEmptyString = false, transformEntry = false, duplicateKeys = [] } = {}){
  let result = {}
  // let flatten = [ 'zoo' ]

  // all arrays we need to squash (in place) later
  const arraysWithOrder = new Set()

  const isIterable = !!(typeof formData[Symbol.iterator] === 'function')

  const entries = isIterable ?  Array.from(formData) : Object.entries(formData)

  for (const entry of entries) {
    if (removeEmptyString && entry[1] === '') continue

    let entryOut
    if (transformEntry) {
      entryOut = transformEntry(entry, isIterable)
    }
    else {
      entryOut =  { path: entry[0], value: entry[1] }
    }
    entryOut = fixArrayNotationForPlainObjects( entryOut, isIterable)
    const { path, value } = allowDuplicatesInIterables(entryOut, isIterable, duplicateKeys)

    const pathParts = extractPathParts(path)

    let currentPathObject = result
    pathParts.forEach((pathPart, idx) => {
      const [ nextPathValue, setNextPathValue ] = handlePathPart(
        pathPart,
        currentPathObject,
        arraysWithOrder,
      )


      if (pathParts.length - 1 === idx) {
        if (nextPathValue !== undefined) {
          throw new DuplicateKeyError(pathPart.pathToPart)
        }
        setNextPathValue(value)
      }
      else {
        if (
          nextPathValue !== undefined &&
          !isJsonObject(nextPathValue) &&
          !Array.isArray(nextPathValue)
        ) {
          throw new DuplicateKeyError(pathPart.pathToPart)
        }

        const nextPathObject = nextPathValue ?? pathPart.default
        currentPathObject = nextPathObject
        setNextPathValue(nextPathObject)
      }
    })
  }

  for (const orderedArray of Array.from(arraysWithOrder)) {
    // replace array with a squashed array
    // array.flat(0) will remove all empty slots (e.g. [0, , 1] => [0, 1])
    orderedArray.splice(0, orderedArray.length, ...orderedArray.flat(0))
  }

  return result
}
