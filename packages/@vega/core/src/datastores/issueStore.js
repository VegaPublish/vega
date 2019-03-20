// Support various publish-related functions
import lyraClient from 'part:@lyra/base/client'

export function publishIssue(issueId) {
  const url = `/publish/${lyraClient.config().dataset}/${issueId}`
  return lyraClient.request({uri: url, method: 'post'})
}

export function unpublishIssue(issueId) {
  const url = `/publish/${lyraClient.config().dataset}/${issueId}`
  return lyraClient.request({uri: url, method: 'delete'})
}

export function fetchPublishStatus(issueId) {
  const url = `/publish/${lyraClient.config().dataset}/${issueId}/status`
  return lyraClient.request({uri: url, method: 'get'})
}
