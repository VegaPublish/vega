// The focus store reports what object is currently in focus

// @flow
import urlState$ from 'part:@vega/core/datastores/urlstate'
import {omitBy, isNil} from 'lodash'
import {map, publishReplay, refCount} from 'rxjs/operators'

/*
export type Focus = {
  title: string,
  kind: string,
  articleId?: string,
  issueId?: string,
  path?: string
}
*/

const ARTICLE_TITLE = 'Article'
const ISSUE_TITLE = 'Issue'

function extractFocus(urlState) {
  const {tool} = urlState
  if (tool === 'tracks') {
    const viewOptions = urlState.tracks.viewOptions || {}

    if (viewOptions.article) {
      return {
        kind: 'article',
        title: ARTICLE_TITLE,
        articleId: viewOptions.article
      }
    }
    return omitBy(
      {
        kind: 'tracks',
        title: 'Tracks',
        issueId: viewOptions.issue,
        trackId: viewOptions.track,
        stageId: viewOptions.stage
      },
      isNil
    )
  }
  if (tool === 'issues') {
    const viewOptions = urlState.issues.viewOptions || {}

    if (viewOptions.article) {
      return {
        kind: 'article',
        title: ARTICLE_TITLE,
        articleId: viewOptions.article,
        issueId: viewOptions.issue
      }
    }
    if (viewOptions.issue) {
      return {
        kind: 'issue',
        title: ISSUE_TITLE,
        issueId: viewOptions.issue
      }
    }
    return {kind: 'issues', title: 'Issues'}
  }
  if (tool === 'desk') {
    const viewOptions = urlState.desk
    switch (viewOptions.selectedType) {
      case 'article':
        return {
          kind: 'article',
          articleId: viewOptions.selectedDocumentId
        }
      case 'issue':
        return {
          kind: 'article',
          issueId: viewOptions.selectedDocumentId
        }
      case 'track':
        return {
          kind: 'track',
          trackId: viewOptions.selectedDocumentId
        }
      case 'stage':
        return {
          kind: 'stage',
          stageId: viewOptions.selectedDocumentId
        }
      default:
        return {
          kind: viewOptions.selectedType,
          objectId: viewOptions.selectedDocumentId
        }
    }
  }
  return {kind: 'none', title: 'None'}
}

export const focus$ = urlState$.pipe(
  map(event => extractFocus(event.state)),
  publishReplay(1),
  refCount()
)
