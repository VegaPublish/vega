// eslint-disable-next-line import/no-unassigned-import
import 'symbol-observable'
import React from 'react'
import ReactDOM from 'react-dom'
import Root from 'part:@lyra/base/lyra-root'
import {AppContainer} from 'react-hot-loader'

function render(RootComponent) {
  ReactDOM.render(
    <AppContainer>
      <RootComponent />
    </AppContainer>,
    document.getElementById('lyra')
  )
}

render(Root)

if (module.hot) {
  module.hot.accept('part:@lyra/base/lyra-root', () => {
    const nextMod = require('part:@lyra/base/lyra-root')
    const NextRoot = nextMod && nextMod.__esModule ? nextMod.default : nextMod
    render(NextRoot)
  })
}
