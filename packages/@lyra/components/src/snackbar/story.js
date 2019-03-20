import React from 'react'
import Snackbar from 'part:@lyra/components/snackbar/default'
import {storiesOf, action} from 'part:@lyra/storybook'
import {
  withKnobs,
  select,
  text,
  number
} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'

const getKinds = () => select('Kind', ['success', 'error', 'warning', 'info'])

storiesOf('Snackbar')
  .addDecorator(withKnobs)
  .add('Snackbar', () => (
    <Lyra part="part:@lyra/components/snackbar/default" propTables={[Snackbar]}>
      <Snackbar kind={getKinds()} timeout={number('timeout after (sec)', 500)}>
        {text('content', 'This is the content')}
      </Snackbar>
    </Lyra>
  ))
  .add('With action', () => {
    return (
      <Lyra
        part="part:@lyra/components/snackbar/default"
        propTables={[Snackbar]}
      >
        <Snackbar
          kind={getKinds()}
          action={{
            title: text('action title', 'OK, got it')
          }}
          onAction={action('onAction')}
          timeout={number('timeout (prop) im ms', 500)}
        >
          {text('children (prop)', 'This is the content')}
        </Snackbar>
      </Lyra>
    )
  })
