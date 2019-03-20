// @flow
import {get, intersection} from 'lodash'
import lyraClient from 'part:@lyra/base/client'
import {map, publishReplay, refCount, switchMap} from 'rxjs/operators'
import {currentUser$} from '../userStore'
import {evaluateCapability, verifyRoles} from './roleVerifier'

const permissions$ = currentUser$.pipe(
  switchMap(user => {
    // console.log('user', JSON.stringify(user, null, 2))
    const permissionsUrl = `/permissions/${lyraClient.config().dataset}`
    return lyraClient.request({uri: permissionsUrl})
  }),
  publishReplay(1),
  refCount()
)

export function canPerformAction(action, doc) {
  return permissions$.pipe(
    map(permissions => {
      const specificGrants = permissions.grants[action][doc._type]
      if (!specificGrants) {
        return false
      }
      if (specificGrants === true) {
        return true
      }
      return specificGrants.some(capability =>
        evaluateCapability(capability, doc)
      )
    })
  )
}

export function rolesOnDocument(qualifyingRoleNames, doc) {
  return permissions$.pipe(
    map(permissions => {
      return verifyRoles(qualifyingRoleNames, doc, permissions.capabilities)
    })
  )
}

// Return a list of configured tools, based on user roles
export function configuredToolsAvailableToUser(tools, config) {
  return permissions$.pipe(
    map(permissions => {
      const userRoles = []
      const {
        isAdminUser,
        isEditorInVenue,
        isEditorInAnyIssue,
        isEditorInAnyTrack,
        isReviewerInReviewItem
      } = permissions.capabilities

      if (isAdminUser && isAdminUser[0]) {
        userRoles.push('admin')
      }
      if (
        (isEditorInVenue && isEditorInVenue[0]) ||
        (isEditorInAnyIssue && isEditorInAnyIssue[0]) ||
        (isEditorInAnyTrack && isEditorInAnyTrack[0])
      ) {
        userRoles.push('editor')
      }
      if (permissions.grants.update.article) {
        userRoles.push('submitter')
      }
      if (isReviewerInReviewItem && isReviewerInReviewItem[0]) {
        userRoles.push('reviewer')
      }

      return tools
        .map(tool => {
          const itemConfig = config.toolMenu.find(
            item => item.toolName === tool.name
          ) || {
            toolName: tool.name,
            options: {
              hiddenByDefault: false,
              accessibleTo: ['admin']
            }
          }
          const rolesWithAccess = itemConfig.options.accessibleTo
          // if you want all tools, comment out the below if-block
          if (intersection(userRoles, rolesWithAccess).length < 1) {
            return null
          }
          return {
            tool: tool,
            config: itemConfig
          }
        })
        .filter(Boolean)
    })
  )
}
