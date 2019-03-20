import React from 'react'
import PropTypes from 'prop-types'
import {fromEvent} from 'rxjs'
import {share} from 'rxjs/operators'
import {Tooltip} from 'react-tippy'
import GoAlignmentAlignedTo from 'react-icons/lib/go/alignment-aligned-to'

import withCopyContext from './withCopyContext'
import styles from './styles/CopyPath.css'

const typesList = ['issue', 'article', 'articleSnapshot']

function stringifyPath(path) {
  return path.reduce((target, segment, i) => {
    const segmentType = typeof segment
    if (segmentType === 'number') {
      return `${target}[${segment}]`
    }

    if (segmentType === 'string') {
      const separator = i === 0 ? '' : '.'
      return `${target}${separator}${segment}`
    }

    if (segment._key) {
      return `${target}[_key=="${segment._key}"]`
    }

    // eslint-disable-next-line no-console
    console.warn(`Unsupported path segment "${segment}"`)
    return ''
  }, '')
}

function pathToStringArray(path) {
  return path.reduce((items, segment, i) => {
    const segmentType = typeof segment
    if (segmentType === 'number') {
      items.push(`[${segment}]`)
    } else if (segmentType === 'string') {
      items.push(segment)
    } else if (segment._key) {
      items.push(`[_key=="${segment._key}"]`)
    } else {
      // eslint-disable-next-line no-console
      console.error(`Unsupported path segment "${segment}"`)
    }
    return items
  }, [])
}

const copyEvents$ = fromEvent(document, 'copy').pipe(share())

const instructionText = 'Copy pointer to clipboard'

class CopyPathButton extends React.Component {
  static propTypes = {
    documentId: PropTypes.string.isRequired,
    documentType: PropTypes.string.isRequired,
    getValuePath: PropTypes.func.isRequired,
    appendToPath: PropTypes.arrayOf(
      PropTypes.shape({
        _key: PropTypes.string
      })
    )
  }

  state = {
    text: instructionText
  }

  inputElement = React.createRef()

  componentDidMount() {
    this.subscription = copyEvents$.subscribe(event => {
      if (this.inputElement.current === event.target) {
        const jsonString = JSON.stringify(this.createPointer())
        const url = `${window.location.href
          .split('/')
          .slice(0, 9)
          .join('/')}/focusPath=${encodeURIComponent(this.pathString())};`
        event.clipboardData.setData('application/json', jsonString)
        event.clipboardData.setData('text/plain', url)
        event.preventDefault()
      }
    })
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  createPointer() {
    const {documentId} = this.props
    return {
      _type: 'pointer',
      path: this.pathStrings(),
      document: {
        _type: 'reference',
        _ref: documentId
      }
    }
  }

  getPath() {
    const {appendToPath, getValuePath} = this.props
    const _path = getValuePath()
    return appendToPath ? _path.concat(appendToPath) : _path
  }

  pathString() {
    return stringifyPath(this.getPath())
  }

  pathStrings() {
    return pathToStringArray(this.getPath())
  }

  handleCopyPath = event => {
    this.inputElement.current.select()

    try {
      document.execCommand('copy')
      this.setState({text: 'Copied!'})
      setTimeout(() => {
        this.setState({text: instructionText})
      }, 2000)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Unable to copy to clipboard :/')
    }
  }

  handleOnHide = () => {
    this.setState({text: instructionText})
  }

  render() {
    const path = this.pathString()
    const {text} = this.state
    if (typesList.includes(this.props.documentType)) {
      return (
        <div className={styles.root}>
          <input
            readOnly
            ref={this.inputElement}
            value={path}
            className={styles.input}
          />
          <a onClick={this.handleCopyPath} className={styles.link}>
            <Tooltip
              title={text}
              trigger="mouseenter focus"
              onHide={this.handleOnHide}
              animation="scale"
              arrow
              theme="light"
              distance="2"
              duration={50}
            >
              <GoAlignmentAlignedTo />
            </Tooltip>
          </a>
        </div>
      )
    }
    return null
  }
}

export default withCopyContext(CopyPathButton)
