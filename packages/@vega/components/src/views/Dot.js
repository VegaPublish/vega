// @flow

import React from 'react'
import cx from 'classnames'
import styles from './styles/Dots.css'
import {Tooltip} from 'react-tippy'

type Props = {
  dot: {
    color: string,
    title: string
  },
  className?: string
}

export default class Dot extends React.PureComponent<Props> {
  render() {
    const {dot, className, ...rest} = this.props
    return (
      <Tooltip
        {...rest}
        theme="light"
        duration={100}
        arrow
        className={cx(styles.dot, className)}
        title={dot.title}
        html={
          <div style={{color: dot.color}} className={styles.tooltip}>
            <div>
              <div
                className={styles.bigDot}
                style={{backgroundColor: dot.color}}
              />
            </div>
            <div>
              {dot.label && <div className={styles.label}>{dot.label}</div>}
              {dot.title && <div className={styles.title}>{dot.title}</div>}
              {dot.subtitle && (
                <div className={styles.subtitle}>{dot.subtitle}</div>
              )}
            </div>
          </div>
        }
        style={{backgroundColor: dot.color}}
      />
    )
  }
}
