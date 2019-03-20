import PropTypes from 'prop-types'
import React from 'react'
import userStore from 'part:@lyra/base/user'

import LoginDialog from 'part:@lyra/base/login-dialog'
import LyraStudioLogo from 'part:@lyra/base/lyra-studio-logo'
import Spinner from 'part:@lyra/components/loading/spinner'
import CookieTest from './CookieTest'
import ErrorDialog from './ErrorDialog'

export default class LoginWrapper extends React.PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    title: PropTypes.node,
    description: PropTypes.node,
    lyraLogo: PropTypes.node,
    LyraLogo: PropTypes.func,
    LoadingScreen: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
  }

  static defaultProps = {
    title: 'Choose login provider',
    description: null,
    lyraLogo: null,
    LyraLogo: LyraStudioLogo,
    LoadingScreen: Spinner
  }

  state = {isLoading: true, user: null, error: null}

  componentDidMount() {
    this.userSubscription = userStore.currentUser.subscribe({
      next: evt =>
        this.setState({user: evt.user, error: evt.error, isLoading: false}),
      error: error => this.setState({error, isLoading: false})
    })
  }

  componentWillUnmount() {
    this.userSubscription.unsubscribe()
  }

  handleRetry = () => {
    this.setState({error: null, isLoading: true})
    userStore.actions.retry()
  }

  render() {
    const {error, user, isLoading} = this.state
    const {children, LoadingScreen, lyraLogo, LyraLogo} = this.props
    if (lyraLogo) {
      const warning =
        'lyraLogo is a deprecated property on LoginWrapper. Pass a React component to the LyraLogo property instead.'
      console.warn(warning) // eslint-disable-line no-console
    }

    if (isLoading) {
      return typeof LoadingScreen === 'function' ? (
        <LoadingScreen center fullscreen />
      ) : (
        LoadingScreen
      )
    }

    if (error) {
      return <ErrorDialog onRetry={this.handleRetry} error={error} />
    }

    if (!user) {
      return (
        <CookieTest {...this.props}>
          <LoginDialog
            title={this.props.title}
            description={this.props.description}
            LyraLogo={LyraLogo}
          />
        </CookieTest>
      )
    }

    // if (!user.role) {
    //   return <UnauthorizedUser user={user} />
    // }

    return typeof children === 'function' ? children(user) : children
  }
}
