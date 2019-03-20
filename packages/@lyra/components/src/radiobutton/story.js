import React from 'react'
import {storiesOf, action} from 'part:@lyra/storybook'
import RadioButton from 'part:@lyra/components/radiobutton/default'
import {
  withKnobs,
  object,
  boolean,
  text
} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'

storiesOf('Radiobutton')
  .addDecorator(withKnobs)
  .add('Default', () => {
    return (
      <Lyra
        part="part:@lyra/components/radiobutton/default"
        propTables={[RadioButton]}
      >
        <RadioButton
          name="radioButton"
          label={text('label (prop)', 'Label')}
          item={object('Item (prop)', {title: 'test'})}
          checked={boolean('checked (prop)', false)}
          onChange={action('onChange')}
        />
      </Lyra>
    )
  })
