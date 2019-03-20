import React from 'react'
import PropTypes from 'prop-types'
import tools from 'all:part:@lyra/base/tool'
import {RouteScope} from 'part:@vega/core/router'

function ToolContainer(props) {
  if (!tools.length) {
    return (
      <div>
        No tools fulfill the role <code>`tool:@lyra/base/tool`</code>
      </div>
    )
  }

  const {toolName} = props
  const activeTool = tools.find(tool => tool.name === toolName)
  if (!activeTool) {
    return (
      <div>
        Ooops! Tool <code>{toolName}</code> is not among available tools{' '}
        <code>[{tools.map(tool => tool.name).join(', ')}]</code>
      </div>
    )
  }

  const ActiveTool = activeTool.component
  return (
    <RouteScope scope={toolName}>
      <ActiveTool {...props} />
    </RouteScope>
  )
}

ToolContainer.propTypes = {
  toolName: PropTypes.string.isRequired
}

export default ToolContainer
