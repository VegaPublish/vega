/* eslint-disable react/no-multi-comp */
import React from 'react'
import {storiesOf, action} from 'part:@lyra/storybook'

import {
  List as GridList,
  Item as GridItem
} from 'part:@lyra/components/lists/grid'
import {
  List as SortableGridList,
  Item as SortableGridItem,
  DragHandle
} from 'part:@lyra/components/lists/sortable-grid'

import CardPreview from 'part:@lyra/components/previews/card'
import MediaPreview from 'part:@lyra/components/previews/media'

import {arrayMove} from 'react-sortable-hoc'
import {range, random} from 'lodash'
import Chance from 'chance'

const chance = new Chance()

import {withKnobs, boolean, select} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'

const containerStyle = {
  width: '90%',
  height: '90%',
  boxShadow: '0 0 10px #999',
  overflow: 'auto',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translateX(-50%) translateY(-50%)'
}

class SortableGridTester extends React.Component {
  constructor(props, args) {
    super(props, args)
    this.state = {
      items: this.props.items.slice()
    }
  }

  handleOnSort = ({oldIndex, newIndex}) => {
    const {items} = this.state
    this.setState({
      items: arrayMove(items, oldIndex, newIndex)
    })
    this.props.onSort()
  }

  render() {
    const {items} = this.state
    const {renderWith: Preview} = this.props

    return (
      <SortableGridList onSort={this.handleOnSort}>
        {items.map((item, index) => (
          <SortableGridItem key={item.key} index={index}>
            <DragHandle />
            <Preview item={item} />
          </SortableGridItem>
        ))}
      </SortableGridList>
    )
  }
}

storiesOf('List (grid)')
  .addDecorator(withKnobs)
  .add('MediaPreview', () => {
    const items = range(50).map((item, i) => {
      const width = random(10, 80) * 10
      const height = random(10, 50) * 10
      const randomImage = `http://placekitten.com/${width}/${height}`
      return {
        key: `${i}`,
        title: chance.name(),
        imageUrl: randomImage,
        aspect: width / height
      }
    })
    return (
      <Lyra part="part:@lyra/components/lists/grid" propTables={[GridList]}>
        <GridList>
          {items.map(item => (
            <GridItem key={item.key}>
              <MediaPreview item={item} />
            </GridItem>
          ))}
        </GridList>
      </Lyra>
    )
  })

  .add(
    'MediaPreview (sortable)',
    () => {
      const items = range(50).map((item, i) => {
        const width = random(10, 80) * 10
        const height = random(10, 50) * 10
        const randomImage = `http://placekitten.com/${width}/${height}`
        return {
          key: `${i}`,
          title: chance.name(),
          imageUrl: randomImage,
          aspect: width / height
        }
      })
      return (
        <Lyra part="part:@lyra/components/lists/grid" propTables={[GridList]}>
          <div style={containerStyle}>
            <SortableGridTester items={items} renderWith={MediaPreview} />
          </div>
        </Lyra>
      )
    },
    {
      propTables: [GridList],
      role: 'part:@lyra/components/lists/grid'
    }
  )
  .add('Cards', () => {
    const items = range(50).map((item, i) => {
      const width = 300
      const height = 120
      const randomImage = `http://placekitten.com/${width}/${height}`
      return {
        key: `${i}`,
        title: chance.name(),
        subtitle: chance.sentence(),
        description: chance.sentence(1),
        media: <img src={randomImage} height={height} width={width} />
      }
    })

    return (
      <Lyra part="part:@lyra/components/lists/grid" propTables={[GridList]}>
        <GridList>
          {items.map(item => (
            <GridItem key={item.key}>
              <CardPreview item={item} />
            </GridItem>
          ))}
        </GridList>
      </Lyra>
    )
  })
