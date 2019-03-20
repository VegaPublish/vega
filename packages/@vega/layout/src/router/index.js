import {route} from 'part:@vega/core/router'

export const router = route('/', [
  route('/invites/:venue/:inviteToken'),
  route('/venues/:venue/:tool/', params => {
    // horrible horrible hack needed to fix an issue with circular dependencies :/
    const tools = require('all:part:@lyra/base/tool')
    const foundTool = tools.find(tool => tool.name === params.tool)
    return foundTool && route.scope(foundTool.name, '/', [foundTool.router])
  }),
  route.intents('/intents')
])
