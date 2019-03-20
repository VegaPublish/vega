import React from 'react'
import {withDocument} from 'part:@lyra/form-builder'
import FormField from 'part:@lyra/components/formfields/default'
import Invite from './Invite'

export default withDocument(
  class InviteBackLinkInput extends React.Component {
    render() {
      const {document, level, type} = this.props
      return document._id ? (
        <FormField
          level={level}
          label={type.title}
          description={type.description}
        >
          <Invite document={this.props.document} />
        </FormField>
      ) : null
    }
  }
)
