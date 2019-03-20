import React from 'react'
import {storiesOf, action} from 'part:@lyra/storybook'
import {withKnobs, number, text} from 'part:@lyra/storybook/addons/knobs'
import {range} from 'lodash'
import Chance from 'chance'
const chance = new Chance()
import CollectionWrapper from './CollectionWrapper'

import TracksArticlesTable from './TracksArticlesTable'

storiesOf('VEGA: Tracks tool', module)
  .addDecorator(withKnobs)
  .add('TracksArticlesTable', () => {
    const stages = range(number('stages', 5)).map((item, i) => {
      const title = `${chance.word()} ${chance.word()}`
      return {
        _id: `stage-${i}`,
        name: encodeURI(title),
        title: title,
        displayColor: chance.color(),
        order: i
      }
    })

    const tracks = range(number('tracks', 8)).map((item, i) => {
      const title = `${chance.word()} ${chance.word()}`
      const stage = stages[Math.floor(Math.random() * stages.length)]
      return {
        _id: `track-${i}`,
        name: encodeURI(title),
        title: title,
        trackStages: [
          {
            name: `${stage.name}@${encodeURI(title)}`,
            stage: stage
          }
        ]
      }
    })

    const issues = range(number('issues', 15)).map((item, i) => {
      return {
        _id: `issue-${i}`,
        volume: chance.integer({min: 0, max: 20}),
        number: chance.integer({min: 1, max: 50}),
        year: chance.integer({min: 1995, max: 2017})
      }
    })

    const articles = range(number('articles', 85)).map((item, i) => {
      const title = chance.sentence()
      return {
        _id: `article-${i}`,
        name: encodeURI(title),
        title: title,
        stage: stages[Math.floor(Math.random() * stages.length)],
        track: tracks[Math.floor(Math.random() * tracks.length)],
        issue: issues[Math.floor(Math.random() * issues.length)]
      }
    })

    return (
      <TracksArticlesTable
        onUpdateSelection={action('onUpdateSelection')}
        tracks={tracks}
        articles={articles}
        issues={issues}
      />
    )
  })
  .add('CollectionWrapper', () => {
    return (
      <CollectionWrapper
        title={text('title', 'Collection wrapper title')}
        qty={number('number', false)}
        onOpen={() => {}}
        isOpen
      >
        This is the content
      </CollectionWrapper>
    )
  })
