import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/Header.css'
import LoginStatus from './LoginStatus'
import VenueDropdown from './VenueDropdown'
import Search from './Search'
import {StateLink} from 'part:@vega/core/router'
import {capitalize} from 'lodash'
import RoleSelector from './RoleSelector'
import NotificationsBadgePopover from './Notifications/providers/BadgePopover'
import MdSettings from 'react-icons/lib/md/settings'

const venuePropType = PropTypes.shape({
  name: PropTypes.string,
  title: PropTypes.string
})

export default class Header extends React.Component {
  static propTypes = {
    allVenues: PropTypes.arrayOf(venuePropType),
    currentVenue: venuePropType
  }

  state = {
    venueDropdownOpened: false
  }

  handleTitleClick = () => {
    this.setState({venueDropdownOpened: !this.state.venueDropdownOpened}) // eslint-disable-line
  }

  handleVenueDropDownClose = () => {
    this.setState({venueDropdownOpened: false})
  }

  render() {
    const {currentVenue, allVenues} = this.props
    const {venueDropdownOpened} = this.state
    return (
      <header className={styles.root}>
        <h1 onClick={this.handleTitleClick} className={styles.title}>
          {currentVenue.title || capitalize(currentVenue.dataset)} ▼
        </h1>
        <VenueDropdown
          venues={allVenues}
          opened={venueDropdownOpened}
          onClickOutside={this.handleVenueDropDownClose}
          onClose={this.handleVenueDropDownClose}
        />

        <div className={styles.roleSelectorContainer}>
          <RoleSelector />
        </div>

        <div className={styles.searchContainer}>
          <div className={styles.search}>
            <Search venue={currentVenue} />
          </div>
        </div>

        <div className={styles.functions}>
          <StateLink
            state={{venue: currentVenue.dataset, tool: 'desk'}}
            className={styles.settings}
          >
            <MdSettings />
          </StateLink>
          <div className={styles.notificationsContainer}>
            <NotificationsBadgePopover />
          </div>

          <div className={styles.loginStatus}>
            <LoginStatus className="login-status" />
          </div>
        </div>
      </header>
    )
  }
}
