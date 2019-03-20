import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/SingletonList.css'
import {IntentLink} from 'part:@lyra/base/router'
import Ink from 'react-ink'

export default class SingletonList extends React.PureComponent {
  static propTypes = {
    types: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    selectedType: PropTypes.string
  }

  renderSingletons = (type, i) => {
    const isSelected = type.name === this.props.selectedType
    return type.singletons.map(singleton => (
      <li key={type.name + singleton.id} className={styles.itemWrapper}>
        <div className={isSelected ? styles.selected : styles.item}>
          <IntentLink
            className={styles.link}
            intent="edit"
            params={{id: singleton.id, type: type.name}}
          >
            {singleton.title}
            <Ink duration={1000} opacity={0.1} radius={200} />
          </IntentLink>
        </div>
      </li>
    ))
  }

  render() {
    return (
      <ul className={styles.list}>
        {this.props.types.map(this.renderSingletons)}
      </ul>
    )
  }
}
