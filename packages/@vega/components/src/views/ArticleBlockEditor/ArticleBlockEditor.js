import PropTypes from 'prop-types'
import React from 'react'
import {BlockEditor} from 'part:@lyra/form-builder'
import {renderCustomMarkers} from '../CustomMarkers'
import renderBlockActions from './renderBlockActions'

export default class ArticleBlockEditor extends React.Component {
  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string
    }).isRequired,
    level: PropTypes.number,
    value: PropTypes.array,
    markers: PropTypes.array,
    onChange: PropTypes.func.isRequired
  }

  render() {
    return (
      <div>
        <BlockEditor
          {...this.props}
          renderCustomMarkers={renderCustomMarkers}
          renderBlockActions={renderBlockActions}
        />
      </div>
    )
  }
}
