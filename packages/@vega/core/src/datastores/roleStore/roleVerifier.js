/* eslint-disable max-depth, no-console */
import {get} from 'lodash'
const swapRefForIdRegex = /_ref$/gi

function evaluateCapabilities(relevantCapabilities, doc) {
  return relevantCapabilities.filter(Boolean).some(capability => {
    if (capability.length === 1) {
      return capability[0] // true|false
    }
    return evaluateCapability(capability, doc)
  })
}

export function evaluateCapability(capability, doc) {
  const [fieldName, ids] = capability
  const alternativeFieldName = fieldName.replace(swapRefForIdRegex, '_id')
  // E.g. track._ref has been materialized, so check for track._id as well
  const fieldValue = get(doc, fieldName) || get(doc, alternativeFieldName)
  return ids.includes(fieldValue)
}

export function verifyRoles(qualifyingRoleNames, doc, capabilities) {
  const verifiedRoles = []
  if (doc._type === 'article') {
    if (qualifyingRoleNames.includes('admin')) {
      const relevantCapabilities = [capabilities.isAdminUser]
      if (evaluateCapabilities(relevantCapabilities, doc)) {
        verifiedRoles.push('admin')
      }
    }
    if (qualifyingRoleNames.includes('editor')) {
      const relevantCapabilities = [
        capabilities.isEditorInVenue,
        capabilities.isEditorInIssueWithArticle,
        capabilities.isEditorInTrackWithArticle
      ]
      if (evaluateCapabilities(relevantCapabilities, doc)) {
        verifiedRoles.push('editor')
      }
    }
    if (qualifyingRoleNames.includes('submitter')) {
      const relevantCapabilities = [capabilities.isSubmitterInArticle]
      if (evaluateCapabilities(relevantCapabilities, doc)) {
        verifiedRoles.push('submitter')
      }
    }
    if (qualifyingRoleNames.includes('reviewer')) {
      const relevantCapabilities = [capabilities.isReviewerInArticle]
      if (evaluateCapabilities(relevantCapabilities, doc)) {
        verifiedRoles.push('reviewer')
      }
    }
  }
  // if (verifiedRoles.length === 0) {
  //   console.warn(
  //     `Could not verify roles ${qualifyingRoleNames} for ${doc} based on ${capabilities}`
  //   )
  // }
  return verifiedRoles
}
