import React from 'react'
import {storiesOf} from 'part:@lyra/storybook'

import DefaultFormField from 'part:@lyra/components/formfields/default'
import DefaultTextInput from 'part:@lyra/components/textinputs/default'
import {
  withKnobs,
  number,
  text,
  boolean
} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'

storiesOf('Form fields')
  .addDecorator(withKnobs)
  .add('Default', () => {
    const id = 'storyFormField_Default1'
    return (
      <Lyra
        part="part:@lyra/components/formfields/default"
        propTables={[DefaultFormField]}
      >
        <DefaultFormField
          label={text('label (prop)', 'This is the label')}
          description={text('Description (prop)', 'This is the description')}
          level={number('Level (prop)', 0)}
          inline={boolean('Inline (prop)', false)}
          wrapped={boolean('Wrapped (prop)', false)}
        >
          <DefaultTextInput id={id} value="" />
        </DefaultFormField>
      </Lyra>
    )
  })
  .add('Spacing test', () => {
    return (
      <div style={{margin: '1rem'}}>
        <DefaultFormField label="Label" description="Description">
          <DefaultTextInput value="" />
        </DefaultFormField>
        <DefaultFormField label="Label" description="Description">
          <DefaultTextInput value="" />
        </DefaultFormField>
        <DefaultFormField label="Label" description="Description">
          <DefaultTextInput value="" />
        </DefaultFormField>
        <DefaultFormField label="Label" description="Description">
          <DefaultTextInput value="" />
        </DefaultFormField>
      </div>
    )
  })
