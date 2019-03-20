import PropTypes from 'prop-types'
import React from 'react'
import FullscreenDialog from 'part:@lyra/components/dialogs/fullscreen'
import userStore from 'part:@lyra/base/user'
import Button from 'part:@lyra/components/buttons/default'

function handleLogout() {
  userStore.actions.logout()
}

export default function UnauthorizedUser(props) {
  return (
    <FullscreenDialog title="Unauthorized" isOpen centered>
      <p>
        You are not authorized to access this studio. Maybe you could ask
        someone to invite you to collaborate on this project?
      </p>
      <p>
        If you think this is an error, verify that you are logged in with the
        correct account. You are currently logged in as{' '}
        <span>
          {props.user.name} ({props.user.email})
        </span>
      </p>

      <Button onClick={handleLogout}>Logout</Button>
    </FullscreenDialog>
  )
}

UnauthorizedUser.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  })
}
