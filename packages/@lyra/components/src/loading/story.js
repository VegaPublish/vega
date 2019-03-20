import React from 'react'
import {storiesOf} from 'part:@lyra/storybook'

import Spinner from 'part:@lyra/components/loading/spinner'
import AppLoadingScreen from 'part:@lyra/base/app-loading-screen'

import {withKnobs, boolean, text} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'

import CompanyLogo from 'part:@lyra/base/company-logo?'
import LyraLogo from 'part:@lyra/base/lyra-logo'

storiesOf('Loading')
  .addDecorator(withKnobs)
  .add('Spinner', () => {
    return (
      <Lyra part="part:@lyra/components/loading/spinner" propTables={[Spinner]}>
        <Spinner
          inline={boolean('inline (prop)', false)}
          message={text('Message (prop)', 'This is the message')}
          fullscreen={boolean('fullscreen (prop)', false)}
          center={boolean('center (prop)', false)}
        />
      </Lyra>
    )
  })

  .add(
    'App loading screen',
    // `
    //   Used when app is loading. No use of CSSModules.
    // `,

    () => {
      const logo = CompanyLogo || LyraLogo
      return (
        <Lyra
          part="part:@lyra/base/app-loading-screen"
          propTables={[AppLoadingScreen]}
        >
          <AppLoadingScreen
            logo={boolean('logo') && logo}
            text={text('text') || undefined}
          />
        </Lyra>
      )
    }
  )
