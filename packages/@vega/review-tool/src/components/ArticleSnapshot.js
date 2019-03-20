import React from 'react'
import PropTypes from 'prop-types'
import {FormBuilder} from 'part:@lyra/form-builder'
import schema from 'part:@lyra/base/schema'
import styles from './styles/ArticleSnapshot.css'
import WithPointersAsMarkers from 'part:@lyra/components/with-pointers-as-markers'

const preventDefault = event => event.preventDefault()

export default class ArticleSnapshot extends React.PureComponent {
  static propTypes = {
    snapshot: PropTypes.object,
    highlightedPointerKey: PropTypes.string
  }

  state = {focusPath: []}

  handleFocus = nextFocusPath => {
    this.setState({focusPath: nextFocusPath})
  }

  render() {
    const {snapshot, highlightedPointerKey} = this.props
    const {focusPath} = this.state

    return (
      <div className={styles.root}>
        <form onSubmit={preventDefault}>
          <WithPointersAsMarkers
            documentId={snapshot._id}
            highlightedPointerKey={highlightedPointerKey}
          >
            {pointers => {
              return (
                <FormBuilder
                  onFocus={this.handleFocus}
                  focusPath={focusPath}
                  type={schema.get('articleSnapshot')}
                  schema={schema}
                  markers={pointers}
                  value={snapshot}
                />
              )
            }}
          </WithPointersAsMarkers>
        </form>
      </div>
    )
  }
}
