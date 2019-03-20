import PropTypes from 'prop-types'
import React from 'react'

import schema from 'part:@lyra/base/schema'
import styles from './styles/SchemaPaneResolver.css'

import TypeList from './pane/TypeList'
import SingletonList from './pane/SingletonList'
import DocumentsPane from './pane/DocumentsPane'
import EditorWrapper from './pane/EditorWrapper'
import GetStarted from './GetStarted'
import SplitController from 'part:@lyra/components/panes/split-controller'
import SplitPaneWrapper from 'part:@lyra/components/panes/split-pane-wrapper'
import Snackbar from 'part:@lyra/components/snackbar/default'
import {getPluralDisplayName, getDocumentTypes} from './utils/typeDisplay'
import contentStylesOverride from './pane/styles/contentStylesOverride.css'
import Pane from 'part:@lyra/components/panes/default'

const isSingleton = type => !!type.singletons

const LISTED_TYPES = getDocumentTypes(schema).filter(type => !type.hidden)
const SINGLETON_TYPES = getDocumentTypes(schema).filter(isSingleton)

export default class SchemaPaneResolver extends React.Component {
  static propTypes = {
    router: PropTypes.shape({
      state: PropTypes.object
    }).isRequired
  }

  state = {
    collapsedPanes: []
  }

  componentWillReceiveProps(nextProps) {
    const nextType =
      nextProps.router.state && nextProps.router.state.selectedType
    const currentType =
      this.props.router.state && this.props.router.state.selectedType
    if (nextType !== currentType) {
      this.setState({
        collapsedPanes: []
      })
    }
  }

  handleToggleDocumentsPaneMenu = () => {
    this.setState({
      documentPaneMenuIsOpen: !this.state.documentPaneMenuIsOpen
    })
  }

  handleCloseDocumentsPaneMenu = () => {
    this.setState({
      documentPaneMenuIsOpen: false
    })
  }

  handleShouldCollapse = pane => {
    const collapsedPanes = this.state.collapsedPanes
    collapsedPanes.push(pane.props.paneId)
    this.setState({
      collapsedPanes: collapsedPanes
    })
  }

  handleShouldExpand = pane => {
    this.setState({
      collapsedPanes: this.state.collapsedPanes.filter(
        p => p !== pane.props.paneId
      ) //eslint-disable-line id-length
    })
  }

  render() {
    const {router} = this.props
    const {collapsedPanes} = this.state
    const {selectedType, selectedDocumentId, action} = router.state
    const selectedSchemaType = schema.get(selectedType)

    if (LISTED_TYPES.length === 0) {
      return <GetStarted />
    }

    return (
      <div className={styles.container}>
        <SplitController
          onSholdCollapse={this.handleShouldCollapse}
          onSholdExpand={this.handleShouldExpand}
        >
          <SplitPaneWrapper
            defaultWidth={200}
            minWidth={100}
            paneId="typePane"
            isCollapsed={!!collapsedPanes.find(pane => pane === 'typePane')}
          >
            <Pane
              title="Content"
              styles={contentStylesOverride}
              isSelected={!selectedType && !selectedDocumentId}
              isCollapsed={!!collapsedPanes.find(pane => pane === 'typePane')}
            >
              <SingletonList
                selectedDocumentId={selectedDocumentId}
                types={SINGLETON_TYPES}
              />
              <hr className={styles.divider} />
              <TypeList selectedType={selectedType} types={LISTED_TYPES} />
            </Pane>
          </SplitPaneWrapper>
          {selectedSchemaType &&
            selectedType &&
            !isSingleton(selectedSchemaType) && (
              <SplitPaneWrapper
                defaultWidth={300}
                minWidth={100}
                maxWidth={400}
                paneId="documentsPane"
                isCollapsed={
                  !!collapsedPanes.find(pane => pane === 'documentsPane')
                }
              >
                <DocumentsPane
                  key={selectedType}
                  isCollapsed={
                    !!collapsedPanes.find(pane => pane === 'documentsPane')
                  }
                  selectedType={selectedType}
                  title={getPluralDisplayName(selectedSchemaType) || 'Untitled'}
                  selectedDocumentId={selectedDocumentId}
                  schemaType={selectedSchemaType}
                  router={router}
                  paneId="documentsPane"
                  onExpand={this.handleShouldExpand}
                  onCollapse={this.handleShouldCollapse}
                />
              </SplitPaneWrapper>
            )}
          {!selectedSchemaType && !selectedType && (
            <SplitPaneWrapper>
              <div className={styles.selectContentType}>
                Select content type
              </div>
            </SplitPaneWrapper>
          )}
          {selectedSchemaType && selectedDocumentId && action === 'edit' && (
            <SplitPaneWrapper>
              <EditorWrapper
                key={selectedDocumentId}
                documentId={selectedDocumentId}
                typeName={selectedSchemaType.name}
                schemaType={selectedSchemaType}
              />
            </SplitPaneWrapper>
          )}

          {selectedType && !selectedSchemaType && (
            <SplitPaneWrapper>
              <h2 className={styles.emptyText}>
                Could not find any type named{' '}
                <strong>
                  <em>{selectedType}</em>
                </strong>{' '}
                in schema{' '}
                <strong>
                  <em>{schema.name}</em>
                </strong>
                …
              </h2>
            </SplitPaneWrapper>
          )}
        </SplitController>
        {selectedType && selectedSchemaType && action && action !== 'edit' && (
          // this would normally never happen
          <Snackbar kind="error">Invalid action: {action}</Snackbar>
        )}
      </div>
    )
  }
}
