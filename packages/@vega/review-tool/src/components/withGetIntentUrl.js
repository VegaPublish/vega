import React from 'react'

export default function withNavigateIntent(Component) {
  return class WithNavigateIntent extends React.Component {
    static contextTypes = {
      __internalRouter: () => {}
    }

    getIntentUrl = (...args) => {
      return this.context.__internalRouter.resolveIntentLink(...args)
    }
    render() {
      return <Component {...this.props} getIntentUrl={this.getIntentUrl} />
    }
  }
}
