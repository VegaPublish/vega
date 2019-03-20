// @flow
import React from 'react'
import {WithVisibility} from '@lyra/preview/components'
import Comment from '../providers/Comment'
import CommentPlaceholder from '../views/CommentPlaceholder'

export default class LazyComment extends React.PureComponent<*> {
  render() {
    return (
      <WithVisibility hideDelay={Infinity}>
        {isVisible =>
          isVisible ? <Comment {...this.props} /> : <CommentPlaceholder />
        }
      </WithVisibility>
    )
  }
}
