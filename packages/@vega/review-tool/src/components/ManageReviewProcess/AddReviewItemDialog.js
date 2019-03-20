import React from 'react'
import styles from './styles/AddReviewItem.css'
import UUID from '@lyra/uuid'
import Dialog from 'part:@lyra/components/dialogs/default'
import TextInput from 'part:@lyra/components/textinputs/default'
import lyraClient from 'part:@lyra/base/client'
import InviteLink from './InviteLink'
import animals from 'animals'
import adjectives from 'adjectives'
import {capitalize, sample} from 'lodash'
import Button from 'part:@lyra/components/buttons/default'

const COMMIT_ACTION = {
  title: 'Invite',
  tooltip: 'Add reviewer and proceed to invitation link',
  name: 'commit',
  color: 'primary'
}

const CLOSE_ACTION = {name: 'close'}

function createName() {
  const animal = animals()
  const adjective = sample(adjectives.filter(adj => adj[0] === animal[0]))
  return [adjective, animal].map(capitalize).join(' ')
}

export default class AddReviewItemDialog extends React.Component<*, *> {
  state = {
    reviewerName: '',
    submitState: null,
    submitResult: null
  }

  handleReviewerNameChange = event => {
    this.setState({reviewerName: event.target.value})
  }

  createReviewer() {
    const {reviewProcess} = this.props
    const {reviewerName} = this.state

    const reviewer = {
      _id: UUID(),
      _type: 'user',
      name: reviewerName,
      isReviewer: true
    }

    const reviewItem = {
      _id: UUID(),
      _type: 'reviewItem',
      reviewProcess: {
        _type: 'reference',
        _ref: reviewProcess._id
      },
      reviewer: {
        _type: 'reference',
        _ref: reviewer._id
      }
    }

    const invite = {
      _id: UUID(),
      _type: 'invite',
      targetType: 'guest',
      message: `You are invited to review the article «${
        reviewProcess.articleSnapshot.title
      }»`,
      target: {_type: 'reference', _ref: reviewer._id, _weak: true},
      isAccepted: false,
      isRevoked: false
    }

    this.setState({submitState: 'isCreating'})
    lyraClient
      .transaction()
      .create(reviewer)
      .create(invite)
      .create(reviewItem)
      .commit()
      .then(
        res => {
          this.setState({submitState: 'isCreated', submitResult: res})
        },
        error => {
          this.setState({submitState: 'error', submitResult: error})
        }
      )
  }

  handleAction = action => {
    if (action.name === 'commit') {
      this.createReviewer()
    }
    if (action.name === 'close') {
      this.props.onClose()
    }
  }

  render() {
    const {reviewerName, submitState, submitResult} = this.state

    const commitAction = {
      ...COMMIT_ACTION,
      disabled: !reviewerName.trim() || submitState !== null
    }

    const closeAction = {
      ...CLOSE_ACTION,
      title: submitState === 'isCreated' ? 'Close' : 'Cancel',
      disabled: submitState === 'isCreating'
    }

    const actions = [
      submitState !== 'isCreated' && commitAction,
      closeAction
    ].filter(Boolean)

    return (
      <Dialog actions={actions} onAction={this.handleAction}>
        <div className={styles.root}>
          {submitState === 'isCreated' && (
            <span>
              Reviewer <em>{reviewerName}</em> added. Below is a link you can
              send to {reviewerName}.
              <InviteLink invite={{_id: submitResult.results[1].id}} />
            </span>
          )}
          {submitState === 'isCreating' && `Adding reviewer…`}

          {submitState === 'error' &&
            `Oops, that went wrong: ${submitResult.message}`}

          {!submitState && (
            <form onSubmit={e => e.preventDefault()}>
              <div>
                Name of reviewer
                <div style={{display: 'flex', width: '100%'}}>
                  <div style={{flexGrow: 1}}>
                    <TextInput
                      value={reviewerName}
                      onChange={this.handleReviewerNameChange}
                      disabled={submitState === 'isCreating'}
                    />
                  </div>
                  <Button
                    title="Assign a random anonymous animal name"
                    onClick={() => this.setState({reviewerName: createName()})}
                  >
                    Anonymize
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </Dialog>
    )
  }
}
