const {configure, lyra} = require('part:@lyra/storybook')

require('normalize.css')
require('part:@lyra/base/theme/body-style')
require('./styles.css')

configure(() => {
  // Trigger loading of stories (side-effect of registering them)
  require('all:part:@lyra/base/component')

  // Explicitly register declares stories (allows us to sort stories before registration)
  lyra.registerDeclaredStories()
}, module)
