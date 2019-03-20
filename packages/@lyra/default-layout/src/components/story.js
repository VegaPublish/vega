import React from 'react'
import {storiesOf, action} from 'part:@lyra/storybook'
import TagsTextField from 'part:@lyra/components/tags/textfield'
import {withKnobs, array, text} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'

storiesOf('Tags')
  .addDecorator(withKnobs)
  .add('Create new', () => {
    return <div>Test</div>
  })
