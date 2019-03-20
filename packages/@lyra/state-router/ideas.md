## Syntax improvements

```js
const routes = ['/:foo/*', [['@baz', 'bar/:baz']]]
```

```js
import {route, scope} from '@lyra/state-router'

const routes = route('/:foo/*', [
  scope(
    'bar',
    route(
      '/bar/:baz/*',
      params =>
        params.baz === 'subbaz'
          ? route('subbaz/:subbaz')
          : route('hubbaz/:hubbaz')
    )
  )
])
```
