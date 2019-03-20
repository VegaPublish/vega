import React from 'react'

import Button from 'part:@lyra/components/buttons/default'
import AnchorButton from 'part:@lyra/components/buttons/anchor'
import DropDownButton from 'part:@lyra/components/buttons/dropdown'
import DefaultFormField from 'part:@lyra/components/formfields/default'
import InInputButton from 'part:@lyra/components/buttons/in-input'
import InInputStyles from 'part:@lyra/components/buttons/in-input-style'
import {storiesOf, action} from 'part:@lyra/storybook'
import {
  withKnobs,
  text,
  select,
  boolean,
  object
} from 'part:@lyra/storybook/addons/knobs'
import LyraLogoIcon from 'part:@lyra/base/lyra-logo-icon'
import DefaultTextInput from 'part:@lyra/components/textinputs/default'
import Lyra from 'part:@lyra/storybook/addons/lyra'

const getButtonKinds = () =>
  select('kind (prop)', ['default', 'simple', 'secondary'], 'default')
const getColorKinds = () =>
  select(
    'color (prop)',
    [false, 'primary', 'success', 'danger', 'white'],
    false
  )

const items = [
  {index: '1', title: 'Test'},
  {index: '2', title: 'Test 2'},
  {index: '3', title: 'Test 3'},
  {index: '4', title: 'Test 4'},
  {index: '5', title: 'Test 5'},
  {index: '6', title: 'Test 6'},
  {index: '7', title: 'Test 7'}
]

storiesOf('Buttons', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    return (
      <Lyra part="part:@lyra/components/buttons/default" propTables={[Button]}>
        <Button
          kind={getButtonKinds()}
          onClick={action('clicked')}
          disabled={boolean('disabled (prop)', false)}
          inverted={boolean('inverted (prop)', false)}
          type={text('type (prop)', undefined)}
          color={getColorKinds()}
          loading={boolean('Loading (prop)', false)}
          icon={boolean('Show test icon', false) ? LyraLogoIcon : false}
        >
          {text('prop: children', 'Touch Me!')}
        </Button>
      </Lyra>
    )
  })
  .add('Anchor <a>', () => {
    return (
      <Lyra part="part:@lyra/components/buttons/anchor" propTables={[Button]}>
        <AnchorButton
          kind={getButtonKinds()}
          onClick={action('clicked')}
          disabled={boolean('prop: disabled', false)}
          inverted={boolean('prop: inverted', false)}
          color={getColorKinds()}
          loading={boolean('prop: loading', false)}
          icon={boolean('show test icon', false) ? LyraLogoIcon : false}
          href={text('prop: href', 'http://example.org')}
        >
          {text('prop: children', 'Touch Me!')}
        </AnchorButton>
      </Lyra>
    )
  })
  .add('Examples', () => {
    const disabled = boolean('Disabled', false)
    return (
      <form style={{padding: '2rem'}}>
        <h2>Default</h2>
        <Button
          onClick={action('clicked')}
          icon={LyraLogoIcon}
          disabled={disabled}
        >
          Default
        </Button>
        <Button
          onClick={action('clicked')}
          icon={LyraLogoIcon}
          inverted
          disabled={disabled}
        >
          Inverted
        </Button>
        <Button
          onClick={action('clicked')}
          icon={LyraLogoIcon}
          kind="simple"
          disabled={disabled}
        >
          Simple
        </Button>

        <h2>Colors</h2>
        <Button onClick={action('clicked')} disabled={disabled}>
          Undefined
        </Button>
        <Button onClick={action('clicked')} color="primary" disabled={disabled}>
          Primary
        </Button>
        <Button onClick={action('clicked')} color="danger" disabled={disabled}>
          Danger
        </Button>
        <Button onClick={action('clicked')} color="success" disabled={disabled}>
          Success
        </Button>

        <h2>Colors (inverted)</h2>
        <Button onClick={action('clicked')} inverted disabled={disabled}>
          Undefined
        </Button>
        <Button
          onClick={action('clicked')}
          color="primary"
          inverted
          disabled={disabled}
        >
          Primary
        </Button>
        <Button
          onClick={action('clicked')}
          color="danger"
          inverted
          disabled={disabled}
        >
          Danger
        </Button>
        <Button
          onClick={action('clicked')}
          color="success"
          inverted
          disabled={disabled}
        >
          Success
        </Button>
        <DropDownButton
          items={items}
          onAction={action('Clicked item')}
          disabled={disabled}
        >
          Dropdown
        </DropDownButton>

        <h2>Colors (simple)</h2>
        <Button onClick={action('clicked')} kind="simple" disabled={disabled}>
          Undefined
        </Button>
        <Button
          onClick={action('clicked')}
          kind="simple"
          color="primary"
          disabled={disabled}
        >
          Primary
        </Button>
        <Button
          onClick={action('clicked')}
          kind="simple"
          color="danger"
          disabled={disabled}
        >
          Danger
        </Button>
        <Button
          onClick={action('clicked')}
          kind="simple"
          color="success"
          disabled={disabled}
        >
          Success
        </Button>

        <h2>With icons</h2>
        <Button
          onClick={action('clicked')}
          icon={LyraLogoIcon}
          disabled={disabled}
        >
          With icon
        </Button>
        <Button
          onClick={action('clicked')}
          color="danger"
          icon={LyraLogoIcon}
          disabled={disabled}
        >
          Colored with icon
        </Button>
        <Button
          onClick={action('clicked')}
          color="danger"
          icon={LyraLogoIcon}
          inverted
          disabled={disabled}
        >
          Danger, inverted & icon
        </Button>
        <DropDownButton
          icon={LyraLogoIcon}
          inverted
          color="danger"
          items={items}
          onAction={action('Clicked item')}
          disabled={disabled}
        >
          Dropdown
        </DropDownButton>

        <h2>Only icons</h2>
        <Button
          onClick={action('clicked')}
          icon={LyraLogoIcon}
          title="Default"
          disabled={disabled}
        />
        <Button
          onClick={action('clicked')}
          icon={LyraLogoIcon}
          color="danger"
          title="Danger"
          disabled={disabled}
        />
        <Button
          onClick={action('clicked')}
          icon={LyraLogoIcon}
          inverted
          title="Inverted"
          disabled={disabled}
        />
        <Button
          onClick={action('clicked')}
          icon={LyraLogoIcon}
          inverted
          color="danger"
          title="Inverted danger"
          disabled={disabled}
        />
        <Button
          onClick={action('clicked')}
          icon={LyraLogoIcon}
          kind="simple"
          title="Simple"
          disabled={disabled}
        />
        <Button
          onClick={action('clicked')}
          icon={LyraLogoIcon}
          kind="simple"
          color="danger"
          title="Simple danger"
          disabled={disabled}
        />

        <h2>On color areas</h2>
        <div style={{backgroundColor: 'red', padding: '1rem'}}>
          <Button onClick={action('clicked')} color="white" disabled={disabled}>
            White
          </Button>
          <Button
            onClick={action('clicked')}
            kind="simple"
            color="white"
            disabled={disabled}
          >
            White simple
          </Button>
          <Button onClick={action('clicked')} inverted disabled={disabled}>
            Inverted
          </Button>
          <Button
            onClick={action('clicked')}
            inverted
            color="white"
            disabled={disabled}
          >
            White inverted
          </Button>
        </div>
      </form>
    )
  })
  .add('DropDownButton', () => {
    return (
      <Lyra
        part="part:@lyra/components/buttons/dropdown"
        propTables={[DropDownButton]}
      >
        <div>
          <DropDownButton
            items={object('prop: items', items)}
            onAction={action('Clicked item')}
            color={getColorKinds()}
            kind={getButtonKinds()}
          >
            {text('prop: children', 'This is a dropdown')}
          </DropDownButton>
          <div>This text should be under the menu</div>
        </div>
      </Lyra>
    )
  })
  .add('InInput', () => {
    return (
      <Lyra
        part="part:@lyra/components/buttons/in-input"
        propTables={[InInputButton]}
      >
        <DefaultFormField label="Default">
          <div className={InInputStyles.wrapper}>
            <DefaultTextInput />
            <div className={InInputStyles.container}>
              <InInputButton
                onAction={action('Clicked item')}
                color={getColorKinds()}
                kind={getButtonKinds()}
              >
                browse
              </InInputButton>
            </div>
          </div>
        </DefaultFormField>
      </Lyra>
    )
  })
