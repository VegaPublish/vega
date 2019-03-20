import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/TypeList.css'
import {StateLink} from 'part:@lyra/base/router'
import Ink from 'react-ink'
import {getPluralDisplayName} from '../utils/typeDisplay'

export default class TypeList extends React.PureComponent {
  static propTypes = {
    types: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    selectedType: PropTypes.string
  }

  renderType = (type, i) => {
    const isSelected = type.name === this.props.selectedType
    return (
      <li key={type.name} className={styles.itemWrapper}>
        <div className={isSelected ? styles.selected : styles.item}>
          <StateLink state={{selectedType: type.name}} className={styles.link}>
            {getPluralDisplayName(type)}
            <Ink duration={1000} opacity={0.1} radius={200} />
          </StateLink>
        </div>
      </li>
    )
  }

  render() {
    return (
      <ul className={styles.list}>{this.props.types.map(this.renderType)}</ul>
    )
  }
}
