import PropTypes from 'prop-types'
import React from 'react'
import {RouteScope, withRouterHOC} from 'part:@lyra/base/router'
import absolutes from 'all:part:@lyra/base/absolutes'
import LyraStudioLogo from 'part:@lyra/base/lyra-studio-logo'
import styles from './styles/DefaultLayout.css'
import RenderTool from './RenderTool'
import Navigation from './Navigation'
import ToolSwitcher from 'part:@lyra/default-layout/tool-switcher'
import PlusIcon from 'part:@lyra/base/plus-icon'
import ActionModal from './ActionModal'
import schema from 'part:@lyra/base/schema'
import Branding from './Branding'
import Ink from 'react-ink'
import HamburgerIcon from 'part:@lyra/base/hamburger-icon'
import Button from 'part:@lyra/components/buttons/default'
import {SchemaErrorReporter} from './SchemaErrorReporter'
import {startCase} from 'lodash'
import SpaceSwitcher from './SpaceSwitcher'
import {HAS_SPACES} from '../util/spaces'
import UpdateNotifier from './UpdateNotifier'
import AppLoadingScreen from 'part:@lyra/base/app-loading-screen'

export default withRouterHOC(
  class DefaultLayout extends React.Component {
    static propTypes = {
      router: PropTypes.shape({
        state: PropTypes.object,
        navigate: PropTypes.func
      }),
      tools: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string
        })
      )
    }

    state = {
      createMenuIsOpen: false,
      mobileMenuIsOpen: false,
      showLoadingScreen: true,
      loaded: false
    }

    componentDidMount() {
      if (this._loadingScreenElement && this.state.showLoadingScreen) {
        this._loadingScreenElement.addEventListener(
          'animationend',
          this.handleAnimationEnd,
          false
        )
      }
    }

    componentWillUnmount() {
      if (this._loadingScreenElement) {
        this._loadingScreenElement.removeEventListener(
          'animationend',
          this.handleAnimationEnd,
          false
        )
      }
    }

    handleAnimationEnd = event => {
      this.setState({
        showLoadingScreen: false
      })
    }

    componentDidUpdate(prevProps) {
      if (!this.state.loaded) {
        this.setState({
          loaded: true
        })
      }
    }

    handleCreateButtonClick = () => {
      this.setState({
        createMenuIsOpen: !this.state.createMenuIsOpen
      })
    }

    handleActionModalClose = () => {
      this.setState({
        createMenuIsOpen: false
      })
    }

    handleMobileMenuToggle = () => {
      this.setState({
        mobileMenuIsOpen: !this.state.mobileMenuIsOpen
      })
    }

    handleSwitchTool = () => {
      this.setState({
        mobileMenuIsOpen: false
      })
    }

    setLoadingScreenElement = element => {
      this._loadingScreenElement = element
    }

    renderContent = () => {
      const {tools, router} = this.props
      const {createMenuIsOpen, mobileMenuIsOpen} = this.state

      const TYPE_ITEMS = schema
        .getTypeNames()
        .map(typeName => schema.get(typeName))
        .map(type => ({
          key: type.name,
          name: type.name,
          title: type.title || startCase(type.name),
          icon: type.icon
        }))

      const modalActions = TYPE_ITEMS.map(item => {
        return {
          title: item.title,
          params: {type: item.name, icon: item.icon}
        }
      })

      return (
        <div
          className={`${styles.defaultLayout} ${
            mobileMenuIsOpen ? styles.mobileMenuIsOpen : ''
          }`}
        >
          {this.state.showLoadingScreen && (
            <div
              className={
                this.state.loaded || document.visibilityState == 'hidden'
                  ? styles.loadingScreenLoaded
                  : styles.loadingScreen
              }
              ref={this.setLoadingScreenElement}
            >
              <AppLoadingScreen text="Restoring Lyra" />
            </div>
          )}
          <div className={styles.secondaryNavigation}>
            <div className={styles.branding}>
              <Branding />
            </div>
            {HAS_SPACES && (
              <div className={styles.spaceSwitcher}>
                <SpaceSwitcher />
              </div>
            )}
            <a
              className={styles.createButton}
              onClick={this.handleCreateButtonClick}
            >
              <span className={styles.createButtonIcon}>
                <PlusIcon />
              </span>
              <span className={styles.createButtonText}>New</span>
              <Ink duration={200} opacity={0.1} radius={200} />
            </a>
            <div className={styles.mobileCreateButton}>
              <Button
                kind="simple"
                onClick={this.handleCreateButtonClick}
                title="Create new item"
                icon={PlusIcon}
              >
                New
              </Button>
            </div>

            <div className={styles.mobileMenuButton}>
              <Button
                kind="simple"
                onClick={this.handleMobileMenuToggle}
                title="Menu"
                icon={HamburgerIcon}
              />
            </div>
            <ToolSwitcher
              tools={this.props.tools}
              activeToolName={router.state.tool}
              onSwitchTool={this.handleSwitchTool}
              className={styles.toolSwitcher}
            />
          </div>
          <div className={styles.mainArea}>
            <div className={styles.navigation}>
              <Navigation tools={tools} />
            </div>
            <div className={styles.toolContainer}>
              <RouteScope scope={router.state.tool}>
                <RenderTool tool={router.state.tool} />
              </RouteScope>
            </div>
          </div>

          {createMenuIsOpen && (
            <ActionModal
              onClose={this.handleActionModalClose}
              actions={modalActions}
            />
          )}

          <UpdateNotifier />

          <a
            className={styles.lyraStudioLogoContainer}
            href="http://vegapublish.com"
          >
            <LyraStudioLogo />
          </a>

          {absolutes.map((Abs, i) => (
            <Abs key={i} />
          ))}
        </div>
      )
    }

    render() {
      return <SchemaErrorReporter>{this.renderContent}</SchemaErrorReporter>
    }
  }
)
