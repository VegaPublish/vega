/* eslint-disable react/no-multi-comp */
import React from 'react'
import {storiesOf, action} from 'part:@lyra/storybook'
import EditItemFold from 'part:@lyra/components/edititem/fold'
import Lyra from 'part:@lyra/storybook/addons/lyra'
import Chance from 'chance'
import {
  withKnobs,
  boolean,
  text,
  number
} from 'part:@lyra/storybook/addons/knobs'
const chance = new Chance()

storiesOf('Edit item')
  .addDecorator(withKnobs)
  .add('Fold', () => {
    const wrapperStyles = {
      width: '50%',
      margin: '0 auto',
      backgroundColor: '#ccc',
      minHeight: '50vh',
      maxHeight: '70vh',
      paddingTop: '5rem',
      position: 'relative',
      overflow: boolean('scroll', true) ? 'scroll' : 'visible'
    }
    return (
      <div style={wrapperStyles}>
        <p>Over</p>
        <Lyra
          part="part:@lyra/components/edititem/fold"
          propTables={[EditItemFold]}
        >
          <EditItemFold title="Edit this item" onClose={action('onClose')}>
            {text('children (prop)', 'Put your content here')}
            <div style={{height: `${number('content padding', 10)}px`}} />
          </EditItemFold>
        </Lyra>
        <p>Under</p>
        {chance.paragraph()}
        {chance.paragraph()}
        {chance.paragraph()}
        {chance.paragraph()}
        {chance.paragraph()}
        {chance.paragraph()}
        {chance.paragraph()}
        {chance.paragraph()}
      </div>
    )
  })
