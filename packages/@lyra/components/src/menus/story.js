import React from 'react'
import Menu from 'part:@lyra/components/menus/default'
import {storiesOf, action} from 'part:@lyra/storybook'
import LyraIcon from 'part:@lyra/base/lyra-logo-icon'
import {
  withKnobs,
  number,
  boolean,
  select
} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'
import {range} from 'lodash'
import Chance from 'chance'
const chance = new Chance()

storiesOf('Menus')
  .addDecorator(withKnobs)
  .add('Default', () => {
    const icon = boolean('icons', false) ? LyraIcon : false
    const items = range(number('#items', 30)).map((item, i) => {
      return {
        title: chance.name(),
        icon: icon,
        key: i
      }
    })

    const origins = {
      'top-left': 'Top Left',
      'top-right': 'Top Right',
      'bottom-right': 'Bottom Right',
      'bottom-left': 'Bottom left'
    }

    const scrollStyle = {
      width: '70vw',
      height: '70vh',
      border: '1px dotted #ccc',
      position: 'relative',
      overflow: 'scroll'
    }

    return (
      <Lyra part="part:@lyra/components/menus/default" propTables={[Menu]}>
        <div style={boolean('is inside scroll', false) ? scrollStyle : {}}>
          <div>
            <Menu
              onAction={action('onAction')}
              onClose={action('onClose')}
              onClickOutside={action('prop:onClickOutside')}
              items={items}
              origin={select('origin (prop)', origins)}
              isOpen={boolean('isOpen (prop)', true)}
            />
          </div>
        </div>
      </Lyra>
    )
  })
