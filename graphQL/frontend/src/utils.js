function trimFields(fields, setFields) {
  const trimmedFields = { }
  Object.keys(fields).map(key => trimmedFields[key] = fields[key].trim())
  setFields(trimmedFields)

  return trimmedFields
}

export {
  trimFields
}
