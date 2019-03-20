import {
  TITLE_FIELD,
  ABSTRACT_FIELD,
  CONTENT_FIELD
} from 'part:@lyra/base/article-schema-type'

// A copy of an article frozen in time the moment a reviewProcess started
// Just recycling the article type, for now

export default {
  title: 'Article Snapshot',
  name: 'articleSnapshot',
  type: 'document',
  readOnly: true,
  fields: [TITLE_FIELD, ABSTRACT_FIELD, CONTENT_FIELD]
}
