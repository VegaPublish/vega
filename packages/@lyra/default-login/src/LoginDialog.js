/* eslint-disable react/no-multi-comp */
import React from 'react'
import PropTypes from 'prop-types'
import authenticationFetcher from 'part:@lyra/base/authentication-fetcher'
import pluginConfig from 'config:@lyra/default-login'
import FullscreenDialog from 'part:@lyra/components/dialogs/fullscreen'
import LoginDialogContent from 'part:@lyra/base/login-dialog-content'
import generateHelpUrl from '@lyra/generate-help-url'
import styles from './styles/LoginDialog.css'
import cancelWrap from './cancelWrap'

export default class LoginDialog extends React.Component {
  static propTypes = {
    title: PropTypes.node.isRequired,
    description: PropTypes.node,
    LyraLogo: PropTypes.func
  }

  static defaultProps = {
    description: null,
    LyraLogo: null
  }

  state = {
    providers: [],
    error: null
  }

  componentDidMount() {
    this.getProviders = cancelWrap(authenticationFetcher.getProviders())
    this.getProviders.promise
      .then(providers => this.setState({providers: providers}))
      .catch(err => this.setState({error: err}))
  }

  componentWillUnmount() {
    this.getProviders.cancel()
  }

  componentWillUpdate(_, nextState) {
    const {providers} = nextState
    if (
      providers.length === 1 &&
      (pluginConfig.providers && pluginConfig.providers.redirectOnSingle)
    ) {
      this.redirectToProvider(providers[0])
    }
  }

  redirectToProvider(provider) {
    const currentUrl = encodeURIComponent(window.location.toString())
    const params = `origin=${currentUrl}`
    if (provider.custom && !provider.supported) {
      this.setState({
        error: {
          message:
            'This project is missing the required "thirdPartyLogin" ' +
            'feature to support custom logins.',
          link: generateHelpUrl('third-party-login')
        }
      })
      return
    }
    window.location = `${provider.url}?${params}`
  }

  handleLoginButtonClicked = (provider, evnt) => {
    evnt.preventDefault()
    this.redirectToProvider(provider)
  }

  handleErrorDialogClosed = () => {
    this.setState({error: null})
  }

  render() {
    const {error, providers} = this.state
    const {title, description, LyraLogo} = this.props

    if (error) {
      return (
        <FullscreenDialog
          color="danger"
          title="Error"
          isOpen
          centered
          onClose={this.handleErrorDialogClosed}
        >
          <div className={styles.error}>
            {error.message}
            {error.link && (
              <p>
                <a href={error.link}>Read more</a>
              </p>
            )}
          </div>
        </FullscreenDialog>
      )
    }

    if (providers.length < 1) {
      return <div>No providers configured</div>
    }

    return (
      <LoginDialogContent
        title={title}
        description={description}
        providers={providers}
        LyraLogo={LyraLogo}
        onLoginButtonClick={this.handleLoginButtonClicked}
      />
    )
  }
}
