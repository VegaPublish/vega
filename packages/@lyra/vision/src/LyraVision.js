import React from 'react'
import lyraClient from 'part:@lyra/base/client'
import Button from 'part:@lyra/components/buttons/default'
import schema from 'part:@lyra/base/schema?'
import Select from './lyra/Select'
import Vision from './Vision'

import visionGui from './css/visionGui.css'
import jsonInspector from './css/jsonInspector.css'
import jsonDump from './css/jsonDump.css'

const components = {
  Button,
  Select
}

const styles = {
  jsonDump,
  visionGui,
  jsonInspector
}

const client = lyraClient.clone()

// Used in Lyra project
function LyraVision() {
  return (
    <Vision
      styles={styles}
      components={components}
      client={client}
      schema={schema}
    />
  )
}

module.exports = LyraVision
