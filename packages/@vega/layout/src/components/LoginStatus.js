/* eslint-disable react/no-deprecated */
import React from 'react'
import {
  currentUser$,
  logout,
  getProfileImageUrl
} from 'part:@vega/datastores/user'
import {Manager, Target, Popper} from 'react-popper'
import Menu from 'part:@lyra/components/menus/default'
import IconSignOut from 'part:@lyra/base/sign-out-icon'
import styles from './styles/LoginStatus.css'
import {Portal} from 'part:@lyra/components/utilities/portal'
import CaptureOutsideClicks from 'part:@lyra/components/utilities/capture-outside-clicks'
import Escapable from 'part:@lyra/components/utilities/escapable'
import {withPropsStream} from 'react-props-stream'
import {map} from 'rxjs/operators'
import UserIcon from 'react-icons/lib/fa/user'

const loadProps = props$ => currentUser$.pipe(map(user => ({user})))

export default withPropsStream(
  loadProps,
  class LoginStatus extends React.Component {
    state = {
      userMenuOpened: false
    }

    handleUserMenuClose = () => {
      this.setState({
        userMenuOpened: false
      })
    }

    handleUserMenuOpen = () => {
      this.setState({
        userMenuOpened: true
      })
    }

    handleUserMenuItemClick = item => {
      if (item.index === 'signOut') {
        logout()
      }
    }

    render() {
      const {user} = this.props
      const {userMenuOpened} = this.state
      if (!user) {
        return <div>No user</div>
      }

      const profileImage = getProfileImageUrl(user)
      const name = user.name || 'Unknown'
      return (
        <Manager>
          <Target>
            <div
              onClick={
                userMenuOpened
                  ? this.handleUserMenuClose
                  : this.handleUserMenuOpen
              }
            >
              {profileImage ? (
                <img
                  src={getProfileImageUrl(user)}
                  className={styles.userImage}
                  title={`Logged in as ${name}`}
                />
              ) : (
                <UserIcon />
              )}
            </div>
          </Target>
          <Portal>
            <div className={styles.portal}>
              {userMenuOpened && (
                <Popper
                  placement="auto"
                  modifiers={{
                    flip: {
                      boundariesElement: 'viewport'
                    },
                    preventOverflow: {
                      boundariesElement: 'viewport'
                    }
                  }}
                >
                  <Escapable
                    onEscape={event =>
                      (userMenuOpened || event.shiftKey) &&
                      this.handleUserMenuClose()
                    }
                  />
                  <CaptureOutsideClicks
                    onClickOutside={
                      userMenuOpened ? this.handleUserMenuClose : undefined
                    }
                  >
                    <Menu
                      onAction={this.handleUserMenuItemClick}
                      items={[
                        {
                          title: `Log out ${user.name || ''}`,
                          icon: IconSignOut,
                          index: 'signOut'
                        }
                      ]}
                      opened
                      origin="top-right"
                    />
                  </CaptureOutsideClicks>
                </Popper>
              )}
            </div>
          </Portal>
        </Manager>
      )
    }
  }
)
