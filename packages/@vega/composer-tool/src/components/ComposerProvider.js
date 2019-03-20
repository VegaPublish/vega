import React from 'react'
import PropTypes from 'prop-types'
import {WithFormBuilderValue} from 'part:@lyra/form-builder'
import schema from 'part:@lyra/base/schema'
import {withRouterHOC} from 'part:@vega/core/router'
import Editor from './Editor'
import WithPointersAsMarkers from './WithPointersAsMarkers'
import CommunicatorWrapper from 'part:@vega/communicator/wrapper?'
import WithValidation from './WithValidation'
import {debounce} from 'lodash'

class ComposerProvider extends React.PureComponent {
  static propTypes = {
    router: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
  }
  componentDidUpdate() {
    const {router} = this.props
    const {params} = router.state || {}
    const highlightedPointerKey = params ? params.pointer : null
    if (highlightedPointerKey) {
      this.scrollPointerIntoView(highlightedPointerKey)
    }
  }

  scrollPointerIntoView = debounce(highlightedPointerKey => {
    const elm = document.getElementById(highlightedPointerKey)
    if (elm) {
      window.requestAnimationFrame(() => {
        elm.scrollIntoView({behavior: 'smooth', block: 'center'})
      })
    }
  }, 100)

  render() {
    const {router} = this.props
    const {action, id, type, params} = router.state || {}
    if (!id) {
      return <h2>Sorry, need a document ID to show something here</h2>
    }
    const focusedCommentId = params ? params.comment : null
    const highlightedPointerKey = params ? params.pointer : null
    const children = (
      <WithPointersAsMarkers
        documentId={id}
        highlightedPointerKey={highlightedPointerKey}
      >
        {pointers => (
          <WithFormBuilderValue
            key={id}
            schema={schema}
            documentId={id}
            typeName={type}
          >
            {withFormBuilderValueProps => (
              <WithValidation
                value={withFormBuilderValueProps.value}
                schema={schema}
              >
                {validationMarkers => (
                  <Editor
                    markers={pointers.concat(validationMarkers)}
                    {...withFormBuilderValueProps}
                  />
                )}
              </WithValidation>
            )}
          </WithFormBuilderValue>
        )}
      </WithPointersAsMarkers>
    )

    return action === 'create' ? (
      children
    ) : (
      <CommunicatorWrapper
        subjectIds={[id]}
        focusedCommentId={focusedCommentId}
      >
        {children}
      </CommunicatorWrapper>
    )
  }
}

export default withRouterHOC(ComposerProvider)
