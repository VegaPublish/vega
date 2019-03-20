import PropTypes from 'prop-types'
import React from 'react'
import StateMenu from './StateMenu'
import styles from './styles/VenueDropdown.css'
import {withRouterHOC} from 'part:@vega/core/router'
import {capitalize} from 'lodash'

export default withRouterHOC(
  class VenueDropdown extends React.Component {
    static propTypes = {
      router: PropTypes.shape({
        state: PropTypes.shape({
          tool: PropTypes.string,
          venue: PropTypes.string
        })
      }),
      venues: PropTypes.array,
      onClickOutside: PropTypes.func,
      opened: PropTypes.bool,
      onClose: PropTypes.func
    }

    render() {
      const {venues, router} = this.props
      const currentTool = router.state.tool
      const currentVenue = router.state.venue

      const venueItems = venues.map((venue, i) => ({
        key: venue.dataset,
        divider: i === 0,
        selected: currentVenue === venue._id,
        title: venue.title || capitalize(venue.dataset),
        props: {
          state: {
            venue: venue.dataset,
            tool: currentTool
          }
        }
      }))

      return (
        <StateMenu
          items={venueItems}
          isOpen={this.props.opened}
          onClickOutside={this.props.onClickOutside}
          onClose={this.props.onClose}
          fullWidth={false}
          className={styles.menu}
        />
      )
    }
  }
)
