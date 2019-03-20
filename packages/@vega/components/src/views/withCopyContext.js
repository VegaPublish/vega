import React from 'react'
import PropTypes from 'prop-types'

export default function withCopyContext(ComposedComponent: any) {
  return class WithCopyContext extends React.PureComponent {
    static displayName = `withCopyContext(${ComposedComponent.displayName ||
      ComposedComponent.name})`

    static contextTypes = {
      getValuePath: PropTypes.func,
      formBuilder: PropTypes.any
    }

    focus() {
      this._input.focus()
    }

    setInput = input => {
      this._input = input
    }

    render() {
      const {getValuePath, formBuilder} = this.context
      const doc = formBuilder.getDocument()
      return doc ? (
        <ComposedComponent
          ref={this.setInput}
          {...this.props}
          documentId={doc._id}
          documentType={doc._type}
          getValuePath={getValuePath}
        />
      ) : null
    }
  }
}
