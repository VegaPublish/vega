//@flow
import React from 'react'
import lyraClient from 'part:@lyra/base/client'
import {withPropsStream} from 'react-props-stream'
import {map, distinctUntilChanged, switchMap} from 'rxjs/operators'

type Issue = {
  _id: string,
  title: string,
  volume: number,
  number: number
}

function issueTitle(issue: Issue) {
  const {volume, number, title} = issue
  if (volume && number) {
    return `${volume}.${number} ${issue.title}`
  }
  return title
}

function loadProps(props$) {
  return props$.pipe(
    map(props => props.articleId),
    distinctUntilChanged(),
    switchMap(articleId =>
      lyraClient.observable.fetch(
        `*[_type=="issue" && references("${articleId}")]{_id,title, volume}`
      )
    ),
    map(issues => ({issues}))
  )
}

type Props = {
  issues: Issue[],
  articleId: string
}

export default withPropsStream(
  loadProps,
  class ArticleIssueList extends React.Component<Props> {
    static defaultProps = {
      issues: []
    }

    render() {
      const {issues} = this.props
      if (!issues || issues.length === 0) {
        return <div>No issue</div>
      }
      return (
        <ul>
          {issues.map(issue => (
            <li key={issue._id}>{issueTitle(issue)}</li>
          ))}
        </ul>
      )
    }
  }
)
