import React from 'react'
import {storiesOf, action} from 'part:@lyra/storybook'
import DefaultTextArea from 'part:@lyra/components/textareas/default'
import {
  withKnobs,
  number,
  text,
  boolean
} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'

storiesOf('Text areas')
  .addDecorator(withKnobs)
  .add('Default', () => {
    return (
      <Lyra
        part="part:@lyra/components/textinputs/default"
        propTables={[DefaultTextArea]}
      >
        <DefaultTextArea
          isClearable={boolean('isClearable (prop)', false)}
          placeholder={text('placeholder (prop)', 'This is the placeholder')}
          onChange={action('onChange')}
          onClear={action('onClear')}
          onFocus={action('onFocus')}
          onKeyPress={action('onKeyPress')}
          onBlur={action('onBlur')}
          rows={number('rows (prop)', 2)}
          value={text('value (prop)')}
          disabled={boolean('disabled (prop)', false)}
        />
      </Lyra>
    )
  })
