/* eslint-disable max-len */
import React from 'react'
import {combineLatest} from 'rxjs'
import {map, startWith} from 'rxjs/operators'
import tools from 'all:part:@lyra/base/tool'
import config from 'config:@vega/layout'
import Spinner from 'part:@lyra/components/loading/spinner'
import {IntentLink, withRouterHOC} from 'part:@vega/core/router'
import {configuredToolsAvailableToUser} from 'part:@vega/datastores/role'
import locationStore from 'part:@lyra/base/location'
import {allVenues$, currentVenue$} from 'part:@vega/datastores/venue'
import {router} from 'part:@vega/router'
import {withPropsStream} from 'react-props-stream'
import Header from './Header'
import ToolSelector from './ToolSelector'
import ToolContainer from './ToolContainer'
import styles from './styles/Layout.css'
import {SchemaErrorReporter} from './SchemaErrorReporter'
import VenueConfigCheck from './VenueConfigCheck'
import Button from 'part:@lyra/components/buttons/default'
import client from 'part:@lyra/base/client'
import RequirePermission from '@vega/components/RequirePermission'

function navigate(url, options) {
  locationStore.actions.navigate(url, options)
}

function pickTool(configuredTools) {
  const preferredTool = configuredTools.find(
    item => !item.config.options.hiddenByDefault
  )
  return preferredTool || configuredTools[0]
}

class Layout extends React.Component {
  handleLogout = () => {
    client.auth.logout()
    document.location.reload()
  }

  updateAvailableTools = configuredTools => {
    this.setState({configuredTools})
    if (configuredTools && configuredTools.length > 0) {
      this.setState({isLoading: false})
      const {tool} = this.props.router.state || {}
      if (
        !configuredTools.some(
          configuredTool => configuredTool.tool.name === tool
        )
      ) {
        this.redirectToAvailableTool()
      }
    }
  }

  redirectToAvailableTool() {
    const {configuredTools} = this.state
    const {venue} = this.props.router.state
    const nextConfiguredTool = pickTool(configuredTools)

    navigate(
      router.encode({
        venue: venue,
        tool: nextConfiguredTool.tool.name
      }),
      {replace: true}
    )
  }

  renderContent = () => {
    const {tool, venue} = this.props.router.state || {}
    const {isLoading, allVenues, currentVenue, configuredTools} = this.props

    if (isLoading) {
      return <Spinner center message="Loading…" />
    }

    if (configuredTools.length === 0) {
      return (
        <div>
          <h2>Sorry, you don't have access... yet?</h2>
          <p>
            You are logged in with a user that does not have access to the venue
            named "{venue}". You could try:
          </p>
          <ul>
            <li>
              Logging out, and back in with another user{' '}
              <Button onClick={this.handleLogout}>Logout</Button>
            </li>
            <li>Contact an admin or editor and have them grant you access.</li>
          </ul>
        </div>
      )
    }

    return (
      <div>
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <Header allVenues={allVenues} currentVenue={currentVenue} />
          </div>
        </div>

        <div className={styles.menu}>
          <div className={styles.menuInner}>
            <div className={styles.menus}>
              <div className={styles.toolSelector}>
                <ToolSelector tools={configuredTools} activeToolName={tool} />
              </div>
              <ul className={styles.createMenu}>
                <RequirePermission action="create" subject={{_type: 'issue'}}>
                  {({permissionGranted}) =>
                    permissionGranted && (
                      <li key="new-issue" className={styles.menuItem}>
                        <IntentLink
                          intent="create"
                          params={{type: 'issue'}}
                          className={styles.menuLink}
                        >
                          <div className={styles.toolName}>New Issue</div>
                        </IntentLink>
                      </li>
                    )
                  }
                </RequirePermission>

                <RequirePermission action="create" subject={{_type: 'article'}}>
                  {({permissionGranted}) =>
                    permissionGranted && (
                      <li key="new-article" className={styles.menuItem}>
                        <IntentLink
                          intent="create"
                          params={{type: 'article'}}
                          className={styles.menuLink}
                        >
                          <div className={styles.toolName}>New Article</div>
                        </IntentLink>
                      </li>
                    )
                  }
                </RequirePermission>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.workArea}>
          <ToolContainer toolName={tool} venueName={venue} />
        </div>
      </div>
    )
  }

  render() {
    return (
      <VenueConfigCheck>
        {() => <SchemaErrorReporter>{this.renderContent}</SchemaErrorReporter>}
      </VenueConfigCheck>
    )
  }
}

export default withPropsStream(
  props$ =>
    combineLatest([
      props$,
      currentVenue$,
      allVenues$,
      configuredToolsAvailableToUser(tools, config)
    ]).pipe(
      map(([props, currentVenue, allVenues, configuredTools]) => ({
        ...props,
        isLoading: false,
        currentVenue,
        allVenues,
        configuredTools
      })),
      startWith({isLoading: true})
    ),
  withRouterHOC(Layout)
)
