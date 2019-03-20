const uuid = require('@lyra/uuid')

function assignDocumentId(doc) {
  if (doc._id) {
    return doc
  }

  return Object.assign({_id: uuid()}, doc)
}

module.exports = assignDocumentId
