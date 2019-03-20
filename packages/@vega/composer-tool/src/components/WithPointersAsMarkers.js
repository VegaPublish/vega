// @flow
import React from 'react'
import {withPropsStream} from 'react-props-stream'
import lyraClient from 'part:@lyra/base/client'
import {defer, combineLatest} from 'rxjs'
import {flatten} from 'lodash'
import {
  map,
  switchMap,
  publishReplay,
  refCount,
  distinctUntilChanged
} from 'rxjs/operators'
import reduce from 'json-reduce'
import {toFormBuilder} from '@vega/utils/convertPath'

const client$ = defer(
  () => require('part:@vega/core/datastores/urlstate').default
).pipe(
  map(event => lyraClient.config({dataset: event.state.venue})),
  publishReplay(1),
  refCount()
)

const TYPES_CONTAINING_POINTERS = ['comment', 'reviewItem']

const assemblePointersAndComments = documents => {
  return flatten(
    documents.map(document => {
      return reduce(
        document,
        (acc, node, path) => {
          return node._type === 'pointer'
            ? acc.concat({pointer: node, comment: document})
            : acc
        },
        []
      )
    })
  )
}

const buildReferencingDocsQuery = id => {
  const typeFilter = TYPES_CONTAINING_POINTERS.map(
    typeName => `_type == "${typeName}"`
  ).join(' || ')

  return `*[(${typeFilter}) && references("${id}")][0...10000]{..., subject->{_id, _type}}`
}

function connect(props$) {
  const documentId$ = props$.pipe(
    map(props => props.documentId),
    distinctUntilChanged()
  )

  const referringDocuments$ = combineLatest(documentId$, client$).pipe(
    switchMap(([documentId, client]) => {
      const query = buildReferencingDocsQuery(documentId)
      return client.observable.fetch(query)
    })
  )

  const pointers$ = referringDocuments$.pipe(
    map(assemblePointersAndComments),
    map(pointersAndComments => {
      return pointersAndComments.map(({pointer, comment}) => ({
        type: 'pointer',
        item: {pointer, comment},
        path: pointer.path ? toFormBuilder(pointer.path.join('')) : []
      }))
    })
  )

  return combineLatest(props$, pointers$).pipe(
    map(([props, pointers]) => ({
      ...props,
      pointers: pointers
    }))
  )
}
type Pointer = {}
type Props = {
  highlightedPointerKey: ?string,
  pointers: Pointer[],
  children: (pointers: Pointer[]) => React.Node
}

export default withPropsStream(
  connect,
  class WithPointersAsMarkers extends React.Component<Props> {
    render() {
      const {children, pointers, highlightedPointerKey} = this.props
      if (highlightedPointerKey) {
        const pointer = pointers.find(
          pntr => pntr.item.pointer._key === highlightedPointerKey
        )
        if (pointer) {
          pointer.highlighted = highlightedPointerKey
        }
      }
      return children(pointers)
    }
  }
)
