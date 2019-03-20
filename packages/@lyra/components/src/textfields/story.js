import React from 'react'
import {storiesOf, action} from 'part:@lyra/storybook'
import DefaultTextField from 'part:@lyra/components/textfields/default'
import SearchTextField from 'part:@lyra/components/textfields/search'
import {withKnobs, boolean, text} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'

storiesOf('Textfields')
  .addDecorator(withKnobs)
  .add('Default', () => {
    return (
      <Lyra
        part="part:@lyra/components/textfields/default"
        propTables={[DefaultTextField]}
      >
        <DefaultTextField
          label={text('label (prop)', 'This is the label')}
          placeholder={text('placeholder (prop)', 'This is the placeholder')}
          value={text('value (prop)')}
          hasError={boolean('hasError (prop)', false)}
          onChange={action('onChange')}
          onFocus={action('onFocus')}
          onClear={action('onClear')}
          isClearable={boolean('isClearable (prop)', false)}
          hasFocus={boolean('hasFocus (prop)', false)}
        />
      </Lyra>
    )
  })
  .add('Search', () => {
    return (
      <Lyra
        part="part:@lyra/components/textfields/search"
        propTables={[SearchTextField]}
      >
        <SearchTextField
          label={text('label (prop)', 'This is the label')}
          placeholder={text('placeholder (prop)', 'This is the placeholder')}
          value={text('value (prop)')}
          hasFocus={boolean('hasFocus (prop)', false)}
          onChange={action('onChange')}
          isClearable={boolean('isClearable (prop)', false)}
        />
      </Lyra>
    )
  })
  .add('Spacing test', () => {
    return (
      <div style={{margin: '1rem'}}>
        <DefaultTextField label="Label" placeholder="Placeholder" />
        <DefaultTextField label="Label" placeholder="Placeholder" />
        <DefaultTextField label="Label" placeholder="Placeholder" />
        <DefaultTextField label="Label" placeholder="Placeholder" />
      </div>
    )
  })
