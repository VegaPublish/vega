import React from 'react'
import PropTypes from 'prop-types'
import {capitalize} from 'lodash'
import Spinner from 'part:@lyra/components/loading/spinner'
import Button from 'part:@lyra/components/buttons/default'
import {withRouterHOC} from 'part:@vega/core/router'
import RequirePermission from '@vega/components/RequirePermission'
import ArticleFormBuilderInput from './ArticleFormBuilderInput'
import styles from './styles/Editor.css'
import IssueFormBuilderInput from './IssueFormBuilderInput'
import {toFormBuilder} from '@vega/utils/convertPath'
import ValidationList from 'part:@lyra/components/validation/list'
import {Tooltip} from 'react-tippy'
import ChevronDown from 'part:@lyra/base/chevron-down-icon'
import WarningIcon from 'part:@lyra/base/warning-icon'
import SavingState from './SavingState'

const preventDefault = event => event.preventDefault()

class Editor extends React.PureComponent {
  static getDerivedStateFromProps(props) {
    const routerState = props.router.state
    const {focusPath, ...rest} = routerState.params || {}
    if (focusPath) {
      // this is rather ugly, sorry
      // need to clear focus path from url after it has been read
      props.router.navigate({
        ...routerState,
        params: rest
      })
      return {focusPath: toFormBuilder(focusPath)}
    }
    return null
  }

  static propTypes = {
    router: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    value: PropTypes.object,
    markers: PropTypes.array,
    type: PropTypes.object,
    isLoading: PropTypes.bool,
    onChange: PropTypes.func,
    isSaving: PropTypes.bool,
    onDelete: PropTypes.func
  }

  state = {
    deleteState: null,
    focusPath: []
  }

  handleDelete = () => {
    const {onDelete, type} = this.props
    if (
      // eslint-disable-next-line no-alert
      window.confirm(`Really delete this ${type.name}?`)
    ) {
      this.setState({deleteState: {isDeleting: true}})
      onDelete().subscribe({
        error: err => {
          this.setState({deleteState: {error: err}})
        },
        next: () => {
          this.setState({deleteState: {isDeleted: true}})
        }
      })
    }
  }

  handleFocus = nextFocusPath => {
    this.setState({focusPath: nextFocusPath})
  }

  render() {
    const {type, value, onChange, markers, isSaving, isLoading} = this.props
    const {focusPath, showValidationTooltip, deleteState} = this.state

    if (deleteState) {
      const {isDeleted, isDeleting, error} = deleteState
      if (isDeleting) {
        return (
          <div className={styles.deletedMessage}>
            Deleting {capitalize(type.name)}…
          </div>
        )
      }
      if (isDeleted) {
        return (
          <div className={styles.deletedMessage}>
            {capitalize(type.name)} was successfully deleted
          </div>
        )
      }
      if (error) {
        return (
          <div className={styles.deletedMessage}>
            Could not delete {capitalize(type.name)}: {error.message}
          </div>
        )
      }
    }

    if (isLoading) {
      return <Spinner center />
    }

    const subject = value || {_type: 'venue', _id: 'venue'} // if we're creating a new article/issue, require venue editor role
    const Input =
      type.name === 'article' ? ArticleFormBuilderInput : IssueFormBuilderInput

    const validation = markers.filter(marker => marker.type === 'validation')
    const errors = validation.filter(marker => marker.level === 'error')
    const warnings = validation.filter(marker => marker.level === 'warning')

    return (
      <div className={styles.root}>
        <div className={styles.toolbar}>
          <RequirePermission action="update" subject={subject}>
            {({permissionGranted}) =>
              permissionGranted && (
                <div className={styles.deleteButton}>
                  <Button color="danger" onClick={this.handleDelete}>
                    Delete
                  </Button>
                </div>
              )
            }
          </RequirePermission>
          <SavingState isSaving={isSaving} />
          {(errors.length > 0 || warnings.length > 0) && (
            <Tooltip
              arrow
              theme="light noPadding"
              trigger="click"
              position="bottom"
              interactive
              duration={100}
              style={{padding: 0}}
              html={
                <ValidationList
                  markers={validation}
                  showLink
                  isOpen={showValidationTooltip}
                  documentType={type}
                  onFocus={this.handleFocus}
                />
              }
            >
              <Button color="danger" icon={WarningIcon} padding="small">
                {errors.length}
                <span style={{paddingLeft: '0.5em'}}>
                  <ChevronDown />
                </span>
              </Button>
            </Tooltip>
          )}
        </div>
        <form onSubmit={preventDefault}>
          <Input
            onFocus={this.handleFocus}
            focusPath={focusPath}
            type={type}
            markers={markers}
            value={value || {_type: type.name}}
            onChange={onChange}
          />
        </form>
      </div>
    )
  }
}

export default withRouterHOC(Editor)
