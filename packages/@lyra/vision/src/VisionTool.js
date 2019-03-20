import {route} from 'part:@lyra/base/router'
import LyraVision from './LyraVision'
import VisionIcon from './components/VisionIcon'

export default {
  router: route('/*'),
  name: 'vision',
  title: 'Vision',
  icon: VisionIcon,
  component: LyraVision
}
