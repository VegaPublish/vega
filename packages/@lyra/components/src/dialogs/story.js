import React from 'react'
import {storiesOf, action, linkTo} from 'part:@lyra/storybook'
import {
  withKnobs,
  text,
  select,
  boolean,
  object
} from 'part:@lyra/storybook/addons/knobs'
import Button from 'part:@lyra/components/buttons/default'
import DefaultDialog from 'part:@lyra/components/dialogs/default'
import DialogContent from 'part:@lyra/components/dialogs/content'
import ConfirmDialog from 'part:@lyra/components/dialogs/confirm'
import FullscreenDialog from 'part:@lyra/components/dialogs/fullscreen'
import Lyra from 'part:@lyra/storybook/addons/lyra'
import PopOverDialog from 'part:@lyra/components/dialogs/popover'

const style = {
  position: 'absolute',
  fontSize: '2em',
  zIndex: '-1'
}

const backgroundStuff = function(storyFn) {
  return (
    <div>
      <div style={style}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industrys standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </div>
      {storyFn()}
    </div>
  )
}

storiesOf('Dialogs')
  .addDecorator(backgroundStuff)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const actions = [
      {
        index: '1',
        title: 'Finish',
        color: 'primary',
        autoFocus: true
      },
      {
        index: '2',
        title: 'Cancel'
      },
      {
        index: '3',
        title: 'Secondary',
        kind: 'simple',
        secondary: true
      }
    ]

    const dialogActions = boolean('has actions', false) ? actions : []

    return (
      <Lyra
        part="part:@lyra/components/dialogs/default"
        propTables={[DefaultDialog]}
      >
        <div>
          <Button onClick={action('oh noes! I should not ble clickable!')}>
            Try click me
          </Button>
          <DefaultDialog
            title={text('title', 'This is the title')}
            isOpen={boolean('is Open', true)}
            showHeader={boolean('Show Header', false)}
            color={select('Color', [
              'default',
              'danger',
              'success',
              'info',
              'warning'
            ])}
            onClose={action('onClose')}
            onAction={action('onAction')}
            actions={
              dialogActions ? object('Actions (prop)', actions) : undefined
            }
          >
            <DialogContent>
              <div style={{padding: '2em'}}>
                {text(
                  'content',
                  'This is the content and it is big. Very big yes so big.'
                )}
              </div>
            </DialogContent>
          </DefaultDialog>
        </div>
      </Lyra>
    )
  })

  .add('Fullscreen', () => {
    const actions = [
      {
        index: '1',
        title: 'Default'
      },
      {
        index: '2',
        title: 'Finish',
        color: 'success',
        autoFocus: true
      },
      {
        index: '3',
        title: 'Cancel',
        color: 'danger'
      },
      {
        index: '4',
        title: 'Secondary',
        kind: 'simple',
        secondary: true
      }
    ]

    const dialogActions = boolean('has actions', false) ? actions : []

    return (
      <Lyra
        part="part:@lyra/components/dialogs/fullscreen"
        propTables={[FullscreenDialog]}
      >
        <div>
          <Button onClick={linkTo('Dialogs', 'Fullscreen (open)')}>
            Open fullscreen dialog
          </Button>
          <FullscreenDialog
            title={text(
              'title (prop)',
              'This is the title and it is very long. In fact it is so long that it will break and make a magic new line'
            )}
            onClose={action('onClose')}
            color={select('Color (prop)', [
              'default',
              'danger',
              'success',
              'info',
              'warning'
            ])}
            centered={boolean('Centered (prop)', false)}
            isOpen={boolean('is Open (prop)', true)}
            actions={object('actions (prop)', dialogActions)}
            onAction={action('onAction')}
          >
            {text('content', 'This is the content')}
          </FullscreenDialog>
        </div>
      </Lyra>
    )
  })

  .add('PopOver', () => {
    const actions = [
      {
        index: '1',
        title: 'Default'
      },
      {
        index: '2',
        title: 'Finish',
        color: 'success',
        autoFocus: true
      },
      {
        index: '3',
        title: 'Cancel',
        color: 'danger'
      },
      {
        index: '4',
        title: 'Secondary',
        kind: 'simple',
        secondary: true
      }
    ]

    return (
      <div style={{top: '50%', left: '50%', position: 'absolute'}}>
        <Lyra
          part="part:@lyra/components/dialogs/confirm"
          propTables={[ConfirmDialog]}
        >
          <PopOverDialog
            actions={boolean('has actions', false) ? actions : []}
            color={select('color (prop)', [
              undefined,
              'danger',
              'success',
              'info',
              'warning'
            ])}
          >
            {text('children (prop)', 'Do you really want to?')}
          </PopOverDialog>
        </Lyra>
      </div>
    )
  })

  .add('Confirm', () => {
    return (
      <Lyra
        part="part:@lyra/components/dialogs/confirm"
        propTables={[ConfirmDialog]}
      >
        <ConfirmDialog
          color={select('color (prop)', [
            undefined,
            'danger',
            'success',
            'info',
            'warning'
          ])}
          confirmColor={select('confirmColor (prop)', [
            undefined,
            'danger',
            'success',
            'info',
            'warning'
          ])}
          onConfirm={action('onConfirm')}
          onCancel={action('onCancel')}
          confirmButtonText={text('confirmButtonText (prop)')}
          cancelButtonText={text('confirmButtonText (prop)')}
        >
          {text('children (prop)', 'Do you really want to?')}
        </ConfirmDialog>
      </Lyra>
    )
  })
