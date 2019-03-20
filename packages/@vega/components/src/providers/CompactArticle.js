// @flow
import React from 'react'

import StageDot from './StageDot'
import styles from './styles/CompactArticle.css'
import humanize from 'humanize-list'
import {map, switchMap} from 'rxjs/operators'
import BlockContent from '@lyra/block-content-to-react'
import {withPropsStream} from 'react-props-stream'
import {observePaths} from 'part:@lyra/base/preview'
import ArticleReviewWidget from 'part:@vega/review-tool/article-widget?'
import RequirePermission from './RequirePermission'
import ArticleStageStatus from './ArticleStageStatus'
import EditIcon from 'part:@lyra/base/edit-icon'
import ArticleIssueList from './ArticleIssueList'
import ArticleMetaRow from '../views/ArticleMetaRow'
import IntentButton from '../views/IntentButton'
// import lyraClient from 'part:@lyra/base/client'
// import imageUrlBuilder from '@lyra/image-url'
import AnimateHeight from 'react-animate-height'

type LyraImage = {
  url: string
}

type Author = {
  name: string
}
type Block = {
  _type: 'block'
}
type Article = {
  _id: string,
  title: string,
  authors: Author[],
  abstract: Block[],
  stage: {_ref: string},
  mainImage: {
    asset: LyraImage
  }
}

type Props = {
  isOpen: boolean,
  onToggle: string => void,
  article: Article,
  showIssues: boolean
}

function renderByline(authors: Author[]) {
  return authors
    ? `By ${humanize(authors.map(author => author.name))}`
    : authors
}

function loadProps(props$) {
  return props$.pipe(
    switchMap(props =>
      observePaths(props.article, [
        '_id',
        'title',
        'authors',
        'abstract',
        'stage.displayColor',
        'mainImage'
      ]).pipe(
        map(article => ({
          ...props,
          article
        }))
      )
    )
  )
}

export default withPropsStream(
  loadProps,
  class CompactArticle extends React.Component<Props> {
    _articleElement: any

    handleTitleClick = () => {
      const {article, onToggle} = this.props
      onToggle(article._id)
    }

    componentDidMount() {
      const {isOpen} = this.props
      if (isOpen) {
        this._articleElement.scrollIntoView()
      }
    }

    setArticleElement = (element: ?HTMLDivElement) => {
      this._articleElement = element
    }

    render() {
      const {article, isOpen, showIssues} = this.props
      // TODO: fix main image url
      return (
        <div
          className={isOpen ? styles.maximizedArticle : styles.minimizedArticle}
          ref={this.setArticleElement}
        >
          <div className={styles.clickArea} onClick={this.handleTitleClick}>
            <div className={styles.mainImageContainer}>
              {article.mainImage &&
                article.mainImage.asset &&
                article.mainImage.asset.url && (
                  <img
                    src={article.mainImage.asset.url}
                    className={styles.mainImage}
                  />
                )}
            </div>
            <div className={styles.heading}>
              <h3 className={styles.title}>{article.title}</h3>

              <p className={styles.headLineAuthors}>
                {article.authors &&
                  article.authors.length > 0 &&
                  renderByline(article.authors)}
                {(!article.authors || article.authors.length == 0) && (
                  <span>No authors</span>
                )}
              </p>
            </div>
            <div className={styles.stageDot}>
              {!isOpen && <StageDot stage={article.stage} />}
            </div>
          </div>
          <AnimateHeight height={isOpen && article ? 'auto' : 0} duration={100}>
            {isOpen && (
              <div
                className={
                  article ? styles.contentLoaded : styles.contentLoading
                }
              >
                <div className={styles.collapsableContent}>
                  <div>
                    <div>
                      {article.abstract && (
                        <div className={styles.abstract}>
                          <BlockContent blocks={article.abstract} />
                        </div>
                      )}

                      {ArticleReviewWidget && (
                        <ArticleReviewWidget article={article} />
                      )}

                      {showIssues && (
                        <ArticleMetaRow title="Appears in">
                          <ArticleIssueList articleId={article._id} />
                        </ArticleMetaRow>
                      )}

                      <div className={styles.functions}>
                        <div className={styles.primaryFunctions}>
                          <RequirePermission action="update" subject={article}>
                            {({permissionGranted}) =>
                              permissionGranted && (
                                <IntentButton
                                  intent="edit"
                                  icon={EditIcon}
                                  params={{
                                    id: article._id,
                                    type: 'article'
                                  }}
                                  className={styles.openInEditorButton}
                                  title="Edit"
                                >
                                  Edit article
                                </IntentButton>
                              )
                            }
                          </RequirePermission>
                        </div>
                      </div>
                      <ArticleStageStatus article={article} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimateHeight>
        </div>
      )
    }
  }
)
