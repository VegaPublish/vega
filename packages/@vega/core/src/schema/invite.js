// Journal, forum or other publication scene
import {capitalize} from 'lodash'
import icon from 'react-icons/lib/fa/user-plus'
const renderState = ({isAccepted, isRevoked}) => {
  if (isAccepted) {
    return '✅ accepted'
  }
  if (isRevoked) {
    return '⛔ revoked'
  }
  return 'pending…'
}
export default {
  title: 'Invitation',
  name: 'invite',
  type: 'document',
  icon,
  hidden: true,
  liveEdit: true,
  fields: [
    {
      title: 'Type',
      name: 'targetType',
      type: 'string',
      validation: Rule => Rule.required(),
      options: {
        list: [{value: 'guest', title: 'Guest'}, {value: 'user', title: 'User'}]
      }
    },
    {
      title: 'Connected user',
      name: 'target',
      type: 'reference',
      weak: true,
      to: {
        type: 'user'
      }
    },
    {
      title: 'Message to invited user',
      name: 'message',
      type: 'text'
    },
    {
      title: 'is accepted',
      description: 'Invitation has been accepted by user',
      type: 'boolean',
      name: 'isAccepted'
    },
    {
      title: 'Is revoked',
      description: 'Invitation has been revoked',
      type: 'boolean',
      name: 'isRevoked'
    },
    {
      title: 'Is root',
      type: 'boolean',
      name: 'isRootUser',
      hidden: true
    }
  ],
  preview: {
    select: {
      _id: '_id',
      targetType: 'targetType',
      target: 'target.name',
      isAccepted: 'isAccepted',
      isRevoked: 'isRevoked',
      media: 'target.image',
      externalProfileImageUrl: 'target.externalProfileImageUrl'
    },
    prepare(value) {
      return {
        title: value.target,
        subtitle: `${capitalize(
          value.targetType || 'user'
        )} invite (${renderState(value)})`,
        ...(value.media
          ? {media: value.media}
          : {imageUrl: value.externalProfileImageUrl})
      }
    }
  }
}
