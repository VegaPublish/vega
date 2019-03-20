import StorybookTool from './StorybookTool'
import {route} from 'part:@lyra/base/router'

export default {
  router: route('/*'),
  title: 'Storybook',
  name: 'storybook',
  component: StorybookTool
}
