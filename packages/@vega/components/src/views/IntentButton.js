import Button from 'part:@lyra/components/buttons/default'
import React from 'react'
import PropTypes from 'prop-types'

export default class IntentButton extends React.Component {
  static propTypes = {
    intent: PropTypes.string,
    params: PropTypes.object
  }

  static defaultProps = {
    intent: '',
    params: {}
  }

  static contextTypes = {
    __internalRouter: PropTypes.object
  }

  handleClick = event => {
    const {intent, params} = this.props
    const url = this.context.__internalRouter.resolveIntentLink(intent, params)
    this.context.__internalRouter.navigateUrl(url)
  }

  render() {
    const {intent, params, ...rest} = this.props
    return <Button onClick={this.handleClick} {...rest} />
  }
}
