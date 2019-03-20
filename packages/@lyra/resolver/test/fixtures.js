import merge from 'lodash/merge'

function lyraManifest(plugins, parts, opts = {}) {
  return JSON.stringify(
    {
      root: opts.root,
      server: {
        port: 7777
      },
      plugins: plugins || [],
      parts: parts
    },
    null,
    2
  )
}

function pluginManifest(props) {
  return JSON.stringify(props, null, 2)
}

function instagramManifest() {
  return pluginManifest({
    paths: {
      source: 'src',
      compiled: 'lib'
    },

    parts: [
      {
        name: 'part:instagram/commentsList',
        description: 'List of comments...'
      },
      {
        name: 'part:instagram/comment',
        description: 'A comment on instagram'
      },
      {
        implements: 'part:instagram/commentsList',
        path: 'components/CommentsList'
      },
      {
        implements: 'part:instagram/comment',
        path: 'components/Comment'
      },
      {
        name: 'part:instagram/instagramTool',
        implements: 'part:@lyra/default-layout/tool',
        path: 'components/InstagramTool'
      },
      {
        name: 'part:instagram/instagramDiscoverTool',
        implements: 'part:@lyra/default-layout/tool',
        path: 'components/InstaDiscoverTool'
      }
    ]
  })
}

function defaultLayout() {
  return {
    'lyra.json': pluginManifest({
      paths: {
        source: 'src',
        compiled: 'lib'
      },

      parts: [
        {
          name: 'part:@lyra/default-layout/tool',
          description: 'A generic UI tool'
        },
        {
          name: 'part:@lyra/default-layout/settingsPane',
          description: 'One "tab" of the default layout settings'
        },
        {
          implements: 'part:@lyra/core/root',
          path: 'components/Root'
        }
      ]
    })
  }
}

function lyraCore() {
  return {
    core: {
      'lyra.json': pluginManifest({
        plugins: ['@lyra/default-layout'],
        parts: [
          {
            name: 'part:@lyra/core/root',
            description:
              'The main component in the UI hierarchy. Usually a layout.'
          }
        ]
      })
    },
    'default-layout': defaultLayout()
  }
}

export function getResolutionOrderFixture({chosenMethod}) {
  const order = [
    'fullLocalPath',
    'shortLocalPath',
    'subNodeModules',
    'nodeModules'
  ]
  const paths = {
    fullLocalPath: '/lyra/plugins/lyra-plugin-bar/lyra.json',
    shortLocalPath: '/lyra/plugins/bar/lyra.json',
    subNodeModules:
      '/lyra/node_modules/lyra-plugin-foo/node_modules/lyra-plugin-bar/lyra.json',
    nodeModules: '/lyra/node_modules/lyra-plugin-bar/lyra.json'
  }

  const base = {
    '/lyra/lyra.json': lyraManifest(['foo'], [], {root: true}),
    '/lyra/node_modules/lyra-plugin-foo/lyra.json': pluginManifest({
      plugins: ['bar']
    })
  }

  const extendWith = {}
  const startIndex = order.indexOf(chosenMethod)
  for (let i = startIndex; i < order.length; i++) {
    const method = order[i]
    extendWith[paths[method]] = pluginManifest({})
  }

  return Object.assign({}, base, extendWith)
}

export function getDuplicatePartTree() {
  return {
    '/lyra/lyra.json': lyraManifest(['snarkel', 'snuffel']),
    '/lyra/plugins': {
      snarkel: {
        'lyra.json': pluginManifest({
          parts: [
            {
              name: 'part:snarkel/foo',
              description: 'Foo'
            }
          ]
        })
      },
      snuffel: {
        'lyra.json': pluginManifest({
          parts: [
            {
              name: 'part:snarkel/foo',
              description: 'Dupe'
            }
          ]
        })
      }
    }
  }
}

export function getDuplicatePluginTree() {
  return {
    '/lyra/lyra.json': lyraManifest(['form-builder', 'google-maps-input']),
    '/lyra/plugins': {
      'form-builder': {
        'lyra.json': pluginManifest({
          plugins: ['google-maps-input'],
          parts: [
            {
              name: 'part:form-builder/thing',
              description: 'Yup'
            }
          ]
        })
      },
      'google-maps-input': {
        'lyra.json': pluginManifest({
          parts: [
            {
              name: 'part:google-maps-input/thing',
              description: 'Map thing',
              path: './Thing.js'
            }
          ]
        })
      }
    }
  }
}

export function getBasicTree() {
  return {
    '/lyra/lyra.json': lyraManifest(['@lyra/core', 'instagram']),
    '/lyra/node_modules': {
      'lyra-plugin-instagram': {
        'lyra.json': instagramManifest()
      },
      '@lyra': lyraCore()
    }
  }
}

export function getMixedPluginTree() {
  return {
    '/lyra/lyra.json': lyraManifest(['@lyra/core', 'instagram', 'foo']),
    '/lyra/node_modules': {
      'lyra-plugin-instagram': {
        'lyra.json': instagramManifest()
      },
      '@lyra': lyraCore()
    },
    '/lyra/plugins': {
      foo: {
        'lyra.json': pluginManifest({
          paths: {
            compiled: './lib',
            source: './src'
          },

          parts: [
            {
              implements: 'part:@lyra/default-layout/tool',
              path: 'File'
            },
            {
              implements: 'part:instagram/commentsList',
              path: 'InstaComments'
            }
          ]
        })
      }
    }
  }
}

export function getPathAlternatives() {
  return {
    '/lyra/lyra.json': lyraManifest(['foo']),
    '/lyra/plugins': {
      foo: {
        'lyra.json': pluginManifest({
          paths: {
            compiled: './lib',
            source: './src'
          },

          parts: [
            {
              implements: 'part:foo/relative',
              path: 'relative/Path.js'
            },
            {
              implements: 'part:foo/absolute',
              path: '/absolute/path/to/File.js'
            },
            {
              implements: 'part:foo/dot-path',
              path: './locale/en-us.json'
            }
          ]
        })
      }
    }
  }
}

export function getScopedPluginsTree() {
  return {
    '/lyra/lyra.json': lyraManifest(['@lyra/core', '@lyra/foo']),
    '/lyra/node_modules': {
      '@lyra': lyraCore()
    }
  }
}

export function getDeepTree({missingPlugin, missingManifest} = {}) {
  const plugins = ['@lyra/core', 'foo']
  if (missingPlugin) {
    plugins.push('missing')
  }

  const baz = {
    'lyra-plugin-baz': missingManifest
      ? {}
      : {
          'lyra.json': pluginManifest({
            parts: []
          })
        }
  }

  return merge(getBasicTree(), {
    '/lyra/lyra.json': lyraManifest(plugins),
    '/lyra/node_modules': merge(
      {
        'lyra-plugin-foo': {
          'lyra.json': pluginManifest({
            plugins: ['bar'],
            parts: [
              {
                implements: 'part:bar/baz',
                path: 'someFile'
              }
            ]
          })
        },
        'lyra-plugin-bar': {
          'lyra.json': pluginManifest({
            plugins: ['baz'],
            parts: [
              {
                name: 'part:bar/baz',
                description: 'The baz of the bar'
              }
            ]
          })
        }
      },
      baz
    )
  })
}

export function getInvalidJson({atRoot}) {
  return {
    '/lyra/lyra.json': atRoot ? '{foo:bar' : lyraManifest(['instagram']),
    '/lyra/node_modules/lyra-plugin-instagram/lyra.json': '{"invalid"'
  }
}

export function getInvalidManifest({atRoot}) {
  return {
    '/lyra/lyra.json': atRoot ? '{"plugins":"foo"}' : lyraManifest('instagram'),
    '/lyra/node_modules/lyra-plugin-instagram/lyra.json': pluginManifest({
      parts: [
        {
          name: 'path'
        }
      ]
    })
  }
}

export function getInvalidPartDeclaration(opts) {
  return {
    '/lyra/lyra.json': lyraManifest(['foo']),
    '/lyra/plugins/foo/lyra.json': pluginManifest({
      parts: [
        opts.missingDescription
          ? {name: 'part:foo/thing'}
          : {name: 'part:foo/thing', description: 'Thing'},

        opts.unprefixed
          ? {name: 'foo/bar', description: 'Bar'}
          : {name: 'part:foo/bar', description: 'Bar'},

        opts.allPrefixed
          ? {name: 'all:part:foo/baz', description: 'Baz'}
          : {name: 'part:foo/baz', description: 'Baz'},

        opts.doublePrefix
          ? {name: 'part:foo/baz:foo', description: 'Baz'}
          : {name: 'part:foo/baz', description: 'Baz'},

        opts.noPluginName
          ? {name: 'part:foo-bar', description: 'Baz'}
          : {name: 'part:foo/baz', description: 'Baz'},

        opts.noPartName
          ? {name: 'part:foo/', description: 'Baz'}
          : {name: 'part:foo/bar', description: 'Baz'},

        opts.missingImplements
          ? {path: 'file.js'}
          : {path: 'file.js', implements: 'part:foo/thing'},

        opts.missingName
          ? {path: 'file.js'}
          : {path: 'file.js', name: 'part:foo/thingie'},

        opts.missingPath
          ? {implements: 'part:foo/bar'}
          : {path: 'bar.js', implements: 'part:foo/bar'}
      ]
    })
  }
}

export function getStyleTree() {
  return {
    '/lyra/lyra.json': lyraManifest([
      '@lyra/default-layout',
      'material-design',
      'screaming-dev-badge'
    ]),
    '/lyra/node_modules': {
      'lyra-plugin-material-design': {
        'lyra.json': pluginManifest({
          parts: [
            {
              implements: 'part:@lyra/default-layout/header-style',
              path: 'css/header.css'
            }
          ]
        })
      },
      '@lyra': {
        'default-layout': {
          'lyra.json': pluginManifest({
            parts: [
              {
                name: 'part:@lyra/default-layout/header-style',
                description: 'Styling for the header'
              },
              {
                implements: 'part:@lyra/default-layout/header-style',
                path: 'css/header.css'
              }
            ]
          })
        }
      },
      'lyra-plugin-screaming-dev-badge': {
        'lyra.json': pluginManifest({
          parts: [
            {
              implements: 'part:@lyra/default-layout/header-style',
              path: 'css/scream.css'
            }
          ]
        })
      }
    }
  }
}

export function getMultiTree() {
  return {
    '/lyra/lyra.json': lyraManifest([
      '@lyra/base',
      'absolute-thing',
      'another-thing'
    ]),
    '/lyra/node_modules/@lyra': {
      base: {
        'lyra.json': pluginManifest({
          parts: [
            {
              name: 'part:@lyra/base/root',
              description: 'Root component...'
            },
            {
              name: 'part:@lyra/base/absolute',
              description: 'UI elements that position themselves statically'
            }
          ]
        })
      }
    },
    '/lyra/plugins': {
      'lyra-plugin-absolute-thing': {
        'lyra.json': pluginManifest({
          parts: [
            {
              implements: 'part:@lyra/base/absolute',
              path: 'DevBadge.js'
            }
          ]
        })
      },
      'another-thing': {
        'lyra.json': pluginManifest({
          parts: [
            {
              implements: 'part:@lyra/base/absolute',
              path: 'foo/bar.js'
            }
          ]
        })
      }
    }
  }
}

export function getStyleOverriderTree() {
  return {
    '/lyra/lyra.json': lyraManifest(['foo', 'bar']),
    '/lyra/plugins': {
      foo: {
        'lyra.json': pluginManifest({
          parts: [
            {
              name: 'part:foo/button-style',
              description: 'Styles for the foo button'
            },
            {
              name: 'part:foo/button-default-style',
              implements: 'part:foo/button-style',
              path: 'components/Button.css'
            }
          ]
        })
      },
      bar: {
        'lyra.json': pluginManifest({
          parts: [
            {
              implements: 'part:foo/button-style',
              path: 'bar/button.css'
            }
          ]
        })
      }
    }
  }
}

export function getStyleVarTree() {
  return {
    '/lyra/lyra.json': lyraManifest(['@lyra/base', 'some-overrider']),
    '/lyra/node_modules/@lyra': {
      base: {
        'lyra.json': pluginManifest({
          parts: [
            {
              name: 'part:@lyra/base/root',
              description: 'Root component of the system'
            },
            {
              name: 'style-variables',
              description: 'All style variables available in CSS-context'
            },
            {
              name: 'style-variables',
              path: 'styleVariables.js'
            }
          ]
        })
      }
    },
    '/lyra/plugins': {
      'some-overrider': {
        'lyra.json': pluginManifest({
          parts: [
            {
              name: 'style-variables',
              path: 'css/vars.js'
            }
          ]
        })
      },
      'another-thing': {
        'lyra.json': pluginManifest({
          parts: [
            {
              part: 'part:@lyra/base/root',
              path: 'foo/bar.js'
            }
          ]
        })
      }
    }
  }
}

export function getNonAbstractPartTree() {
  return {
    '/lyra/lyra.json': lyraManifest(['base', 'overrider']),
    '/lyra/plugins': {
      base: {
        'lyra.json': pluginManifest({
          parts: [
            {
              // Abstract
              name: 'part:base/thing',
              description: 'Root component of the system'
            },
            {
              // Non-abstract
              name: 'part:base/specific',
              description: 'Specific thingyjane',
              path: 'base/specific.js'
            }
          ]
        })
      },
      overrider: {
        'lyra.json': pluginManifest({
          parts: [
            {
              implements: 'part:base/thing',
              path: 'thing.js'
            },
            {
              implements: 'part:base/specific',
              path: 'specific'
            }
          ]
        })
      }
    }
  }
}

export function getRootLevelPartsTree() {
  return Object.assign({}, getBasicTree(), {
    '/lyra/lyra.json': lyraManifest(
      ['@lyra/core', 'instagram'],
      [
        {
          name: 'part:@lyra/config/schema',
          path: 'schema/schema.js'
        },
        {
          implements: 'part:@lyra/core/root',
          path: 'myRootComponent.js'
        }
      ]
    )
  })
}

export function getParentDirTree() {
  return {
    '/lyra/app/lyra.json': lyraManifest([
      '@lyra/core',
      'instagram',
      '../my-parent-plugin'
    ]),
    '/lyra/app/node_modules': {
      'lyra-plugin-instagram': {
        'lyra.json': instagramManifest()
      },
      '@lyra': lyraCore()
    },
    '/lyra/my-parent-plugin/package.json': JSON.stringify({
      name: 'my-parent-plugin',
      version: '1.0.0'
    }),
    '/lyra/my-parent-plugin/lyra.json': pluginManifest({
      parts: [
        {
          name: 'part:my-parent-plugin/foo/bar',
          path: 'foobar.js'
        }
      ]
    })
  }
}

export function getNodeResolutionTree() {
  return Object.assign({}, getBasicTree(), {
    '/lyra/app/lyra.json': lyraManifest([
      '@lyra/core',
      '@lyra/strawberry',
      'rebeltastic'
    ]),
    '/node_modules': {
      '@lyra': {
        strawberry: {
          'lyra.json': lyraManifest()
        }
      },
      'lyra-plugin-rebeltastic': {
        'lyra.json': lyraManifest()
      }
    }
  })
}
