import React from 'react'
import {storiesOf} from 'part:@lyra/storybook'
import DefaultLabel from 'part:@lyra/components/labels/default'
import {withKnobs, number, text} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'

storiesOf('Labels')
  .addDecorator(withKnobs)
  .add('Default', () => {
    return (
      <Lyra
        part="part:@lyra/components/labels/default"
        propTables={[DefaultLabel]}
      >
        <DefaultLabel
          level={number('level (prop)', 0)}
          htmlFor="thisNeedsToBeUnique"
        >
          {text('children  (prop)', 'Label')}
        </DefaultLabel>
      </Lyra>
    )
  })
