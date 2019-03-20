import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/ArticleMetaRow.css'

export default class ArticleMetaRow extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node
  }

  state = {
    isOpen: true
  }

  handleTitleClick = () => {
    this.setState({open: !this.state.open})
  }

  render() {
    const {title, children} = this.props
    const {isOpen} = this.state
    return (
      <div className={styles.root} onClick={this.handleClick}>
        <dt className={styles.title}>{title}</dt>
        {isOpen && <dd className={styles.content}>{children}</dd>}
      </div>
    )
  }
}
