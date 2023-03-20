const createMessage = (body, type, options) => {
  return {
    body,
    type,
    source: 'ffc-grants-productivity',
    ...options
  }
}

module.exports = createMessage
