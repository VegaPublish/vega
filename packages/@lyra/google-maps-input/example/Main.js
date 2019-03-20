import React from 'react'
import FormBuilder from 'part:@lyra/form-builder'
import LyraIntlProvider from 'part:@lyra/base/lyra-intl-provider'

export default class QuickstartExample extends React.Component {
  state = {
    editorValue: FormBuilder.createEmpty('myTestLocation')
  }

  handleChange = event => {
    this.setState({editorValue: this.state.editorValue.patch(event.patch)})
  }

  handleLogClick = event => {
    console.log(this.state.editorValue) // eslint-disable-line no-console
  }

  render() {
    return (
      <LyraIntlProvider supportedLanguages={['en-US']}>
        <FormBuilder
          value={this.state.editorValue}
          onChange={this.handleChange}
        />
        <button type="button" onClick={this.handleLogClick}>
          Output current value to console
        </button>
      </LyraIntlProvider>
    )
  }
}
