import PropTypes from 'prop-types'
import React from 'react'
import {get} from 'lodash'
import {withRouterHOC} from 'part:@vega/core/router'
import ArticleFeatures from './ArticleFeatures'
import styles from './styles/ArticleStateTool.css'

// eslint-disable-next-line
class ArticleStateTool extends React.Component {
  static propTypes = {
    router: PropTypes.shape({
      state: PropTypes.object
    }).isRequired
  }

  render() {
    const {router} = this.props
    const articleId = get(router, 'state.viewOptions.article')
    if (!articleId) {
      return <div>Oops, no article ID on the URL you rode in on</div>
    }

    return (
      <div className={styles.root}>
        <ArticleFeatures articleId={articleId} />
      </div>
    )
  }
}

export default withRouterHOC(ArticleStateTool)
