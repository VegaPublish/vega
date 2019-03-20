/* eslint-disable react/no-multi-comp */
import React from 'react'
import {storiesOf, action} from 'part:@lyra/storybook'

import {
  List as DefaultList,
  Item as DefaultItem
} from 'part:@lyra/components/lists/default'
import {
  List as SortableList,
  Item as SortableItem,
  DragHandle
} from 'part:@lyra/components/lists/sortable'

import {arrayMove} from 'react-sortable-hoc'
import {range, random} from 'lodash'
import Chance from 'chance'

const chance = new Chance()

import {
  withKnobs,
  boolean,
  select,
  number
} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'

const containerStyle = {
  width: '90%',
  height: '90%',
  boxShadow: '0 0 10px #999',
  overflow: 'hidden',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translateX(-50%) translateY(-50%)'
}

const defaultItems = range(100).map((item, i) => {
  return {
    key: `${i}`,
    title: chance.name()
  }
})

class SortableTester extends React.Component {
  constructor(props, args) {
    super(props, args)
    this.state = {
      items: this.props.items.slice()
    }
  }

  handleOnSort = event => {
    const {items} = this.state
    const {oldIndex, newIndex} = event
    this.setState({
      items: arrayMove(items, oldIndex, newIndex)
    })
    this.props.onSort(event)
  }

  render() {
    const {items} = this.state

    return (
      <SortableList {...this.props} onSort={this.handleOnSort}>
        {items.map((item, index) => {
          return (
            <SortableItem index={index} key={index}>
              <DragHandle />
              {item.title}
            </SortableItem>
          )
        })}
      </SortableList>
    )
  }
}

storiesOf('List')
  .addDecorator(withKnobs)
  .add('Default', () => {
    return (
      <Lyra
        part="part:@lyra/components/lists/default"
        propTables={[DefaultList]}
      >
        <div style={containerStyle}>
          <DefaultList>
            {defaultItems.map((item, index) => {
              return <DefaultItem key={index}>{item.title}</DefaultItem>
            })}
          </DefaultList>
        </div>
      </Lyra>
    )
  })
  .add('Sortable', () => {
    return (
      <Lyra
        part="part:@lyra/components/lists/sortable"
        propTables={[SortableList]}
      >
        <div style={containerStyle}>
          <SortableTester items={defaultItems} />
        </div>
      </Lyra>
    )
  })
