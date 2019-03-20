import React from 'react'
import {storiesOf, action} from 'part:@lyra/storybook'
import Switch from 'part:@lyra/components/toggles/switch'
import {withKnobs, boolean, text} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'
import ActivateOnFocus from 'part:@lyra/components/utilities/activate-on-focus'

storiesOf('Utilities')
  .addDecorator(withKnobs)
  .add('Activate on focus', () => {
    return (
      <Lyra
        part="part:@lyra/components/utilities/activate-on-focus"
        propTables={[Switch]}
      >
        <div
          style={{
            height: '700px',
            width: '500px',
            border: '3px dotted #ccc',
            position: 'relative',
            padding: '20px'
          }}
        >
          <ActivateOnFocus
            onFocus={action('onFocus')}
            onBlur={action('onBlur')}
            message={text('message (prop)')}
            enableBlur={boolean('enableBlur (prop)', false)}
          >
            <textarea rows="30">
              This should not be selected on first click
            </textarea>
          </ActivateOnFocus>
        </div>
      </Lyra>
    )
  })
