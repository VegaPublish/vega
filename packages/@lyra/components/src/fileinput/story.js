import React from 'react'
import {storiesOf, action} from 'part:@lyra/storybook'
import {withKnobs, text, boolean} from 'part:@lyra/storybook/addons/knobs'

import FileInput from 'part:@lyra/components/fileinput/default'
import FileInputButton from 'part:@lyra/components/fileinput/button'
import Lyra from 'part:@lyra/storybook/addons/lyra'

storiesOf('File Input')
  .addDecorator(withKnobs)
  .add('Default', () => {
    return (
      <Lyra
        part="part:@lyra/components/fileinput/default"
        propTables={[FileInput]}
      >
        <FileInput onSelect={action('onSelect')}>
          All this content triggers a file select from device
        </FileInput>
      </Lyra>
    )
  })
  .add('Button', () => {
    return (
      <Lyra
        part="part:@lyra/components/fileinput/button"
        propTables={[FileInputButton]}
      >
        <FileInputButton onSelect={action('onSelect')}>
          Upload file…
        </FileInputButton>
      </Lyra>
    )
  })
