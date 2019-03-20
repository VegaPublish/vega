import PropTypes from 'prop-types'
import React from 'react'
import {union} from 'lodash'
import {
  auditTime,
  filter,
  map,
  mergeMapTo,
  share,
  switchMapTo,
  catchError
} from 'rxjs/operators'
import {defer, merge, throwError, of as observableOf} from 'rxjs'
import client from 'part:@lyra/base/client'
import shallowEquals from 'shallow-equals'

function deprecatedCheck(props, propName, componentName, ...rest) {
  if (React.isValidElement(props[propName])) {
    return new Error(
      `Passing a React element as ${propName} to ${componentName} is deprecated. Use a function instead.`
    )
  }
  return PropTypes.func.isRequired(props, propName, componentName, ...rest)
}

function createInitialState() {
  return {
    result: null,
    complete: false,
    loading: true,
    error: false
  }
}

function keysEqual(object, otherObject, excludeKeys = []) {
  const objectKeys = Object.keys(object).filter(
    key => !excludeKeys.includes(key)
  )
  const otherObjectKeys = Object.keys(otherObject).filter(
    key => !excludeKeys.includes(key)
  )

  if (objectKeys.length !== otherObjectKeys.length) {
    return false
  }

  return union(objectKeys, otherObjectKeys).every(
    key => object[key] === otherObject[key]
  )
}

const fetch = (query, params) =>
  defer(() => client.observable.fetch(query, params))

export default class QueryContainer extends React.Component {
  static propTypes = {
    query: PropTypes.string,
    params: PropTypes.object,
    mapFn: PropTypes.func,
    children: deprecatedCheck
  }

  static defaultProps = {
    mapFn: props => props
  }

  state = createInitialState()

  componentWillMount() {
    this.subscribe(this.props.query, this.props.params)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  subscribe(query, params) {
    this.unsubscribe()

    const events$ = client
      .listen(query, params, {
        events: ['welcome', 'mutation', 'error', 'reconnect']
      })
      .pipe(share())

    const welcome$ = events$.pipe(filter(ev => ev.type === 'welcome'))
    const mutations$ = events$.pipe(filter(ev => ev.type === 'mutation'))
    const reconnect$ = events$.pipe(
      filter(ev => ev.type === 'reconnect'),
      mergeMapTo(throwError(new Error('Connection lost. Reconnecting…')))
    )
    const docs$ = merge(
      reconnect$,
      welcome$.pipe(mergeMapTo(fetch(query, params))),
      mutations$.pipe(
        auditTime(1000),
        switchMapTo(fetch(query, params))
      )
    ).pipe(
      map(documents => ({
        error: null,
        loading: false,
        result: {documents}
      })),
      catchError(err =>
        observableOf({
          error: err,
          loading: false
        })
      )
    )

    this._subscription = docs$.subscribe(nextState => this.setState(nextState))
  }

  unsubscribe() {
    if (this._subscription) {
      this._subscription.unsubscribe()
    }
  }

  componentWillReceiveProps(nextProps) {
    const sameQuery = nextProps.query === this.props.query
    const sameParams = shallowEquals(nextProps.params, this.props.params)

    if (!sameQuery || !sameParams) {
      this.setState(createInitialState())
      this.subscribe(nextProps.query, nextProps.params)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!shallowEquals(this.state, nextState)) {
      return true
    }
    if (
      nextProps.query !== this.props.query ||
      !shallowEquals(nextProps.params, this.props.params)
    ) {
      return true
    }

    return !keysEqual(nextProps, this.props, ['mapFn', 'query', 'params'])
  }

  renderDeprecated() {
    return React.cloneElement(
      React.Children.only(this.props.children),
      this.props.mapFn(this.state)
    )
  }

  refresh = () => {
    this.subscribe(this.props.query, this.props.params)
  }

  render() {
    const {children, mapFn, ...rest} = this.props
    if (React.isValidElement(children)) {
      return this.renderDeprecated()
    }
    if (!children || typeof children !== 'function') {
      return (
        <div>
          Invalid usage of QueryContainer. Expected a function as its only child
        </div>
      )
    }
    return children({...rest, onRetry: this.refresh, ...mapFn(this.state)})
  }
}
