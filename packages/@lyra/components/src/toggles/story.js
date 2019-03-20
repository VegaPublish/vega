import React from 'react'
import {storiesOf, action} from 'part:@lyra/storybook'
import ToggleButtons from 'part:@lyra/components/toggles/buttons'
import ToggleButton from 'part:@lyra/components/toggles/button'
import Switch from 'part:@lyra/components/toggles/switch'
import Checkbox from 'part:@lyra/components/toggles/checkbox'
import LyraLogoIcon from 'part:@lyra/base/lyra-logo-icon'
import {
  withKnobs,
  boolean,
  text,
  select
} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'

storiesOf('Toggles')
  .addDecorator(withKnobs)
  .add('Switch', () => {
    return (
      <Lyra part="part:@lyra/components/toggles/switch" propTables={[Switch]}>
        <Switch
          checked={
            boolean('undefined', false)
              ? undefined
              : boolean('checked (prop)', false)
          }
          label={text('label (prop)', 'This is the label')}
          disabled={boolean('disabled (prop)', false)}
          onChange={action('change')}
          onFocus={action('onFocus')}
          onBlur={action('onBlur')}
        />
      </Lyra>
    )
  })
  .add('Checkbox', () => {
    return (
      <Lyra
        part="part:@lyra/components/toggles/checkbox"
        propTables={[Checkbox]}
      >
        <Checkbox
          label={text('label (prop)', 'This is the label')}
          checked={
            boolean('undefined', false)
              ? undefined
              : boolean('checked (prop)', false)
          }
          disabled={boolean('disabled (prop)', false)}
          onChange={action('onChange')}
          onBlur={action('onBlur')}
          onFocus={action('onFocus')}
        >
          {boolean('Children') ? <h1>Test</h1> : false}
        </Checkbox>
      </Lyra>
    )
  })
  .add('Buttons', () => {
    const items = [
      {
        title: 'The good',
        key: 'good'
      },
      {
        title: 'The Bad',
        key: 'bad'
      },
      {
        title: 'The ugly',
        key: 'ugly'
      }
    ]
    return (
      <Lyra
        part="part:@lyra/components/toggles/buttons"
        propTables={[ToggleButtons]}
      >
        <ToggleButtons
          items={items}
          label="Select something"
          onChange={action('onChange')}
          value={items[1]}
        />
      </Lyra>
    )
  })
  .add('Toggle button', () => {
    const icon = boolean('icon', false) ? LyraLogoIcon : false
    return (
      <Lyra
        part="part:@lyra/components/toggles/buttons"
        propTables={[ToggleButtons]}
      >
        <ToggleButton
          selected={boolean('selected (prop)', false)}
          disabled={boolean('disabled (prop)', false)}
          onClick={action('onClick')}
          icon={icon}
        >
          {text('children (prop)', 'this is the content')}
        </ToggleButton>
      </Lyra>
    )
  })
  .add('Toggle button collection', () => {
    return (
      <div>
        <ToggleButton
          icon={LyraLogoIcon}
          selected
          onClick={action('onClick')}
        />
        <ToggleButton
          icon={LyraLogoIcon}
          selected
          onClick={action('onClick')}
        />
        <ToggleButton
          icon={LyraLogoIcon}
          selected
          onClick={action('onClick')}
        />
        <ToggleButton
          icon={LyraLogoIcon}
          selected
          onClick={action('onClick')}
        />
      </div>
    )
  })
