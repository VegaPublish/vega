/* eslint-disable react/no-danger */
import React from 'react'

const styles = `
#lyra-root {font: 1.5em sans-serif; padding: 0 1em; max-width: 800px;}
code {background: #f7f7f7;}
pre code {color: #444; display: block; padding: 1em;}
code span {color: #880000;}
@media screen and (max-width: 480px) {
  #lyra-root {font-size: 1em; padding: 0 0.5em;}
}`

const exampleManifest = `{
  "plugins": [
    <span>"@lyra/base"</span>,
    <span>"@lyra/default-layout"</span>
  ]
}`

function DefaultRootComponent() {
  return (
    <div id="lyra-root">
      <style>{styles}</style>

      <h1>Hello, Lyra!</h1>

      <p>
        If you are seeing this, it means that no plugin has fulfilled the{' '}
        <code>part:@lyra/base/root</code> role.
      </p>

      <p>
        Usually, this role is filled by a plugin such as{' '}
        <code>@lyra/default-layout</code>.
      </p>

      <h2>How do I fix it?</h2>
      <p>
        In the <code>lyra.json</code> file of your Lyra configuration, add a
        plugin that fulfills the <code>part:@lyra/base/root</code> role. For
        instance:
      </p>
      <pre>
        <code dangerouslySetInnerHTML={{__html: exampleManifest}} />
      </pre>

      <p>Thanks for using Lyra!</p>
    </div>
  )
}

export default DefaultRootComponent
