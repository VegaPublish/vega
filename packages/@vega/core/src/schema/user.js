// A person who can log in and do stuff
import icon from 'react-icons/lib/fa/user'
import InviteBackLink from './inputs/InviteBackLinkInput'

export default {
  title: 'User',
  name: 'user',
  type: 'document',
  icon,
  liveEdit: true,
  fields: [
    {
      title: 'Name',
      name: 'name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      title: 'Invitation',
      name: 'invite_backlink_',
      type: 'string',
      inputComponent: InviteBackLink
    },
    {
      title: 'Email',
      name: 'email',
      type: 'email'
    },
    {
      title: 'Profile Image',
      name: 'profileImage',
      type: 'image'
    },
    {
      title: 'Note',
      name: 'note',
      type: 'string',
      description: 'E.g. Temporary guest editor'
    },
    {
      title: 'Is Reviewer?',
      name: 'isReviewer',
      type: 'boolean',
      hidden: true,
      description:
        'A reviewer is only concerned with completing a single reviewItem'
    },
    {
      title: 'Is Administrator?',
      name: 'isAdmin',
      type: 'boolean',
      description: 'Only admins can promote other users to admin'
    },
    {
      title: 'External Profile Image URL',
      name: 'externalProfileImageUrl',
      type: 'url'
    },
    {
      name: 'identity',
      title: 'Identity ID',
      type: 'string',
      readOnly: true
    }
  ],
  preview: {
    select: {
      id: '_id',
      name: 'name',
      profileImage: 'profileImage',
      isAdmin: 'isAdmin',
      isReviewer: 'isReviewer',
      externalProfileImageUrl: 'externalProfileImageUrl',
      identity: 'identity'
    },
    prepare(selection) {
      const {
        name,
        profileImage,
        identity,
        isAdmin,
        isReviewer,
        externalProfileImageUrl
      } = selection
      let description = ''
      if (isAdmin) {
        description = ' (admin 👩‍🔧)'
      } else if (isReviewer) {
        description = ' (reviewer)'
      }
      return {
        title: `${name}${description}`,
        subtitle: identity ? '✅ invitation accepted' : '❓ invitation pending',
        ...(profileImage
          ? {media: profileImage}
          : {imageUrl: externalProfileImageUrl})
      }
    }
  }
}
