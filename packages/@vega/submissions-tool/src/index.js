import React from 'react'
import {route} from 'part:@vega/core/router'
import routerParams from '@vega/utils/routerParams'
import SubmissionsTool from './components/SubmissionsTool'

const icon = () => <span />

export default {
  name: 'submissions',
  title: 'Submissions',
  icon: icon,
  router: route(':viewOptions', {
    transform: {
      viewOptions: {
        toState: routerParams.decode,
        toPath: routerParams.encode
      }
    }
  }),
  component: SubmissionsTool
}
