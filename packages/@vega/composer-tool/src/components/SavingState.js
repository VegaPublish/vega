import PropTypes from 'prop-types'
import React from 'react'

export default class SavingState extends React.PureComponent {
  static propTypes = {
    delay: PropTypes.number,
    isSaving: PropTypes.bool
  }
  static defaultProps = {
    delay: 1000
  }

  state = {isSaving: false}

  clear = () => {
    this.setState({isSaving: false})
  }

  componentDidUpdate(prevProps) {
    const isSaving = this.props.isSaving
    const wasSaving = prevProps.isSaving

    if (wasSaving && !isSaving) {
      clearTimeout(this.timerId)
      this.timerId = setTimeout(this.clear, this.props.delay)
    } else if (!wasSaving && isSaving) {
      clearTimeout(this.timerId)
      this.setState({isSaving: true})
    }
  }

  render() {
    return this.state.isSaving ? `Saving…` : ''
  }
}
