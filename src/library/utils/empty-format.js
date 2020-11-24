const emptyFormat = (value) => {
  if (value === null || value === undefined ||
    String(value).length === 0 || (typeof value === 'number' && isNaN(value))) {
    return '--'
  }
  return value
}

export default emptyFormat
