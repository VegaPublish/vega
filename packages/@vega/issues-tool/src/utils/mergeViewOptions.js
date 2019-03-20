// @flow
import {isNil, omitBy} from 'lodash'

type ViewOptions = {
  article?: string,
  issue?: string
}
type RouterState = {
  viewOptions?: ViewOptions
}

type Router = {
  state: RouterState
}

function getViewOptions(routerState: RouterState) {
  return (routerState || {}).viewOptions || {}
}

export default function mergeViewOptions(
  router: Router,
  nextViewOptions: Object
): RouterState {
  const routerState = router.state || {}
  return {
    ...routerState,
    viewOptions: omitBy(
      {...getViewOptions(routerState), ...nextViewOptions},
      isNil
    )
  }
}
