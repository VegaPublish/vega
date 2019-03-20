# @lyra/import

Imports documents from an [ndjson](http://ndjson.org/)-stream to a Lyra dataset

## Installing

```
npm install --save @lyra/import
```

## Usage

```js
const fs = require('fs')
const lyraClient = require('@lyra/client')
const lyraImport = require('@lyra/import')

const client = lyraClient({
  apiHost: '<the lyra api host>',
  dataset: '<your target dataset>',
  token: '<token-with-write-perms>',
  useCdn: false
})

// Input can either be a readable stream (for a `.tar.gz` or `.ndjson` file), a folder location (string), or an array of documents
const input = fs.createReadStream('my-documents.ndjson')
lyraImport(input, {
  client: client,
  operation: 'create' // `create`, `createOrReplace` or `createIfNotExists`
})
  .then(numDocs => {
    console.log('Imported %d documents', numDocs)
  })
  .catch(err => {
    console.error('Import failed: %s', err.message)
  })
```

## CLI-tool

This functionality is built in to the `@lyra/cli` package as well as a standalone [@lyra/import-cli](https://www.npmjs.com/package/@lyra/import-cli) package.

## Future improvements

- When documents are imported, record which IDs are actually touched
  - Only upload assets for documents that are still within that window
  - Only strengthen references for documents that are within that window
  - Only count number of imported documents from within that window
- Asset uploads and strengthening can be done in parallel, but we need a way to cancel the operations if one of the operations fail
- Introduce retrying of asset uploads based on hash + indexing delay
- Validate that dataset exists upon start
- Reference verification
  - Create a set of all document IDs in import file
  - Create a set of all document IDs in references
  - Create a set of referenced ID that do not exist locally
  - Batch-wise, check if documents with missing IDs exist remotely
  - When all missing IDs have been cross-checked with the remote API
    (or a max of say 100 items have been found missing), reject with
    useful error message.

## License

MIT-licensed. See LICENSE.
