import PropTypes from 'prop-types'
import React from 'react'
import {StateLink, withRouterHOC} from 'part:@vega/core/router'
import styles from './styles/ToolSelector.css'

export default withRouterHOC(
  class ToolSelector extends React.Component {
    static propTypes = {
      tools: PropTypes.array,
      activeToolName: PropTypes.string,
      router: PropTypes.shape({
        state: PropTypes.shape({
          venue: PropTypes.string
        })
      })
    }

    render() {
      const {router, activeToolName} = this.props
      const configuredTools = this.props.tools
      const {venue} = router.state
      return (
        <div className={styles.root}>
          <ul className={styles.toolList}>
            {configuredTools.map(item => {
              if (!item.tool) {
                throw new Error(
                  `Invalid menu item: ${JSON.stringify(
                    item.config
                  )}. No matching tool found for: ${
                    item.config.toolName
                  }. Please check your ./config/@vega/layout.json and make sure all tools configured there are also registered plugins.`
                )
              }
              const isActiveTool = activeToolName === item.tool.name
              const itemClass = isActiveTool ? styles.activeItem : styles.item

              const linkContent = (
                <div className={styles.toolName}>{item.tool.title}</div>
              )
              if (item.config.options.hiddenByDefault && !isActiveTool) {
                return null
              }

              return (
                <li key={item.tool.name} className={itemClass}>
                  {item.config.options.hiddenByDefault ? (
                    <a className={styles.toolLink}>{linkContent}</a>
                  ) : (
                    <StateLink
                      state={{venue: venue, tool: item.tool.name}}
                      className={styles.toolLink}
                    >
                      {linkContent}
                    </StateLink>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )
    }
  }
)
