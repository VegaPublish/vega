/* eslint-disable react/no-multi-comp */
import React from 'react'
import ProgressBar from 'part:@lyra/components/progress/bar'
import ProgressCircle from 'part:@lyra/components/progress/circle'
import {
  withKnobs,
  number,
  boolean,
  text
} from 'part:@lyra/storybook/addons/knobs'
import {storiesOf} from 'part:@lyra/storybook'
import Lyra from 'part:@lyra/storybook/addons/lyra'

storiesOf('Progress')
  .addDecorator(withKnobs)
  .add('Progress bar', () => (
    <Lyra part="part:@lyra/components/progress/bar" propTables={[ProgressBar]}>
      <ProgressBar
        percent={number('percentage (prop)', 10, {
          range: true,
          min: 0,
          max: 100,
          step: 1
        })}
        showPercent={boolean('showPercent (prop)', false)}
        text={text('text (prop)', 'Downloaded 5.1 of 8.2Mb')}
      />
    </Lyra>
  ))
  .add('Progress circle', () => (
    <Lyra
      part="part:@lyra/components/progress/circle"
      propTables={[ProgressCircle]}
    >
      <ProgressCircle
        percent={number('percent (prop)', 10, {
          range: true,
          min: 0,
          max: 100,
          step: 1
        })}
        showPercent={boolean('showPercent (prop)', true)}
        text={text('text (prop)', 'Uploaded')}
      />
    </Lyra>
  ))
