import PropTypes from 'prop-types'
import React from 'react'
import {storiesOf, action} from 'part:@lyra/storybook'
import TagsTextField from 'part:@lyra/components/tags/textfield'
import {
  withKnobs,
  array,
  text,
  boolean
} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'

class DefaultTextFieldTagsImplementation extends React.Component {
  static propTypes = {
    tags: PropTypes.arrayOf(PropTypes.string)
  }
  constructor(...args) {
    super(...args)
    this.state = {
      tags: this.props.tags || []
    }
  }

  handleChange = tags => {
    this.setState({
      tags: tags
    })
  }

  render() {
    return (
      <TagsTextField
        label="Tags"
        placeholder="This is the placeholder"
        value={this.state.tags}
        onChange={this.handleChange}
      />
    )
  }
}

storiesOf('Tags')
  .addDecorator(withKnobs)
  .add('Tags', () => {
    const tags = ['Test', 'Lyra']

    return (
      <Lyra
        part="part:@lyra/components/tags/textfield"
        propTables={[TagsTextField]}
      >
        <TagsTextField
          label={text('label (prop)', 'Tags')}
          readOnly={boolean('readOnly (prop)', false)}
          placeholder={text('placeholder (prop)', 'This is the placeholder')}
          value={array('value (prop)', tags)}
          onChange={action('onChange')}
        />
      </Lyra>
    )
  })

  .add('Tags (test)', () => {
    const tags = [
      'Test',
      'Lyra',
      'React',
      'Computer',
      'Macbook',
      'Awesome',
      'Windows',
      'CPU',
      'Moore',
      'Intel',
      'Ada',
      'Enigma'
    ]

    return (
      <Lyra
        part="part:@lyra/components/tags/textfield"
        propTables={[TagsTextField]}
      >
        <DefaultTextFieldTagsImplementation tags={array('tags (prop)', tags)} />
      </Lyra>
    )
  })
