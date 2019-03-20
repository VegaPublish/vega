import {route} from 'part:@vega/core/router'
import Main from './Main'
import routerParams from '@vega/utils/routerParams'

export default {
  name: 'communicator-testbed',
  title: 'Communicator test',
  icon: () => null,
  router: route(':viewOptions', {
    transform: {
      viewOptions: {
        toState: routerParams.decode,
        toPath: routerParams.encode
      }
    }
  }),
  component: Main
}
