import path from 'path'
import assert from 'assert'
import mockFs from 'mock-fs'
import resolvePlugins, {resolveParts, resolveProjectRoot} from '../src/resolver'
import {afterEach, describe, it} from 'mocha'
import {
  getBasicTree,
  getDeepTree,
  getInvalidJson,
  getInvalidManifest,
  getMixedPluginTree,
  getResolutionOrderFixture,
  getScopedPluginsTree,
  getStyleTree,
  getMultiTree,
  getParentDirTree,
  getDuplicatePartTree,
  getInvalidPartDeclaration,
  getStyleOverriderTree,
  getNonAbstractPartTree,
  getRootLevelPartsTree,
  getNodeResolutionTree,
  getPathAlternatives,
  getDuplicatePluginTree
} from './fixtures'

const opts = {basePath: '/lyra'}
const syncOpts = Object.assign({}, opts, {sync: true})

describe('plugin resolver', () => {
  afterEach(() => {
    mockFs.restore()
  })

  it('rejects on invalid root-level JSON', () => {
    mockFs(getInvalidJson({atRoot: true}))
    return resolvePlugins(opts).should.be.rejectedWith(SyntaxError)
  })

  it('rejects on invalid non-root-level JSON', () => {
    mockFs(getInvalidJson({atRoot: false}))
    return resolvePlugins(opts).should.be.rejectedWith(SyntaxError)
  })

  it('rejects on invalid root-level manifest', () => {
    mockFs(getInvalidManifest({atRoot: true}))
    return resolvePlugins(opts).should.be.rejectedWith(
      Error,
      /must be an array/i
    )
  })

  it('rejects on invalid non-root-level manifest', () => {
    mockFs(getInvalidManifest({atRoot: false}))
    return resolvePlugins(opts).should.be.rejectedWith(
      Error,
      /must be an array/i
    )
  })

  describe('rejects on invalid parts declaration', () => {
    it('parts with no path needs a description', () => {
      mockFs(getInvalidPartDeclaration({missingDescription: true}))
      return resolvePlugins(opts)
        .then(shouldHaveThrown)
        .catch(err => {
          err.message.should.contain('index 0')
          err.message.should.contain('`description`')
        })
    })

    it('part names need a prefix', () => {
      mockFs(getInvalidPartDeclaration({unprefixed: true}))
      return resolvePlugins(opts)
        .then(shouldHaveThrown)
        .catch(err => {
          err.message.should.contain('index 1')
          err.message.should.contain('needs a "part:"-prefix')
          err.message.should.contain('xamples')
        })
    })

    it('part names should not include reserved keywords', () => {
      mockFs(getInvalidPartDeclaration({allPrefixed: true}))
      return resolvePlugins(opts)
        .then(shouldHaveThrown)
        .catch(err => {
          err.message.should.contain('index 2')
          err.message.should.contain('"all:"')
          err.message.should.contain('xamples')
        })
    })

    it('part names should not have more than one prefix', () => {
      mockFs(getInvalidPartDeclaration({doublePrefix: true}))
      return resolvePlugins(opts)
        .then(shouldHaveThrown)
        .catch(err => {
          err.message.should.contain('index 3')
          err.message.should.contain('":"')
          err.message.should.contain('xamples')
        })
    })

    it('part names should include plugin name', () => {
      mockFs(getInvalidPartDeclaration({noPluginName: true}))
      return resolvePlugins(opts)
        .then(shouldHaveThrown)
        .catch(err => {
          err.message.should.contain('index 4')
          err.message.should.contain('plugin name')
          err.message.should.contain('xamples')
        })
    })

    it('part names should include part name after plugin name', () => {
      mockFs(getInvalidPartDeclaration({noPartName: true}))
      return resolvePlugins(opts)
        .then(shouldHaveThrown)
        .catch(err => {
          err.message.should.contain('index 5')
          err.message.should.contain('after the plugin name')
          err.message.should.contain('xamples')
        })
    })

    it('parts with `path` should contain `implements` or `name`', () => {
      mockFs(getInvalidPartDeclaration({missingImplements: true}))
      return resolvePlugins(opts)
        .then(shouldHaveThrown)
        .catch(err => {
          err.message.should.contain('index 6')
          err.message.should.contain('either `name` or `implements`')
        })
    })

    it('parts with `path` should contain `implements` or `name`', () => {
      mockFs(getInvalidPartDeclaration({missingName: true}))
      return resolvePlugins(opts)
        .then(shouldHaveThrown)
        .catch(err => {
          err.message.should.contain('index 7')
          err.message.should.contain('either `name` or `implements`')
        })
    })

    it('parts with `implements` should contain `path`', () => {
      mockFs(getInvalidPartDeclaration({missingPath: true}))
      return resolvePlugins(opts)
        .then(shouldHaveThrown)
        .catch(err => {
          err.message.should.contain('index 8')
        })
    })
  })

  it('rejects on missing plugin', () => {
    mockFs(getDeepTree({missingPlugin: true}))
    return resolvePlugins(opts).should.be.rejectedWith(Error, /"missing"/)
  })

  it('rejects on missing plugin manifest', () => {
    mockFs(getDeepTree({missingManifest: true}))
    return resolvePlugins(opts).should.be.rejectedWith(Error, /"lyra\.json"/)
  })

  it('rejects if two plugins define the same part', () => {
    mockFs(getDuplicatePartTree())
    return resolveParts(opts).should.be.rejectedWith(
      Error,
      'both define part "part:snarkel/foo"'
    )
  })

  it('resolves plugins in the right order', () => {
    mockFs(getDeepTree())
    return resolvePlugins(opts).then(plugins => {
      plugins
        .map(plugin => plugin.name)
        .should.eql([
          '@lyra/default-layout',
          '@lyra/core',
          'baz',
          'bar',
          'foo',
          '(project root)'
        ])
    })
  })

  it('does not list duplicate plugins multiple times', () => {
    mockFs(getDuplicatePluginTree())
    return resolvePlugins(opts).then(plugins => {
      plugins.should.have.length(3)
    })
  })

  it('allows resolving plugins synchronously', () => {
    mockFs(getDeepTree())
    const plugins = resolvePlugins(syncOpts)
    plugins
      .map(plugin => plugin.name)
      .should.eql([
        '@lyra/default-layout',
        '@lyra/core',
        'baz',
        'bar',
        'foo',
        '(project root)'
      ])
  })

  describe('respects the lyra plugin resolution order', () => {
    it('prefers fully qualified, local path (/plugins/lyra-plugin-<name>)', () => {
      mockFs(getResolutionOrderFixture({chosenMethod: 'fullLocalPath'}))
      return resolvePlugins(opts).then(plugins => {
        plugins[0].path.should.equal('/lyra/plugins/lyra-plugin-bar')
      })
    })

    it('prefers short-named, local path as 2nd option (/plugins/<name>)', () => {
      mockFs(getResolutionOrderFixture({chosenMethod: 'shortLocalPath'}))
      return resolvePlugins(opts).then(plugins => {
        plugins[0].path.should.equal('/lyra/plugins/bar')
      })
    })

    const subPath =
      '/node_modules/lyra-plugin-<parent>/node_modules/lyra-plugin-<name>'
    it(`prefers fully qualified in parent plugin node_modules as 3rd option (${subPath})`, () => {
      mockFs(getResolutionOrderFixture({chosenMethod: 'subNodeModules'}))
      return resolvePlugins(opts).then(plugins => {
        plugins[0].path.should.equal(
          '/lyra/node_modules/lyra-plugin-foo/node_modules/lyra-plugin-bar'
        )
      })
    })

    it('prefers fully qualified in root node_modules as 4th option (/node_modules/lyra-plugin-<name>)', () => {
      mockFs(getResolutionOrderFixture({chosenMethod: 'nodeModules'}))
      return resolvePlugins(opts).then(plugins => {
        plugins[0].path.should.equal('/lyra/node_modules/lyra-plugin-bar')
      })
    })

    it('follows the node resolution algorithm (trickles down directory tree)', () => {
      mockFs(getNodeResolutionTree())
      const resolveOpts = Object.assign(opts, {basePath: '/lyra/app'})
      return resolvePlugins(resolveOpts).then(plugins => {
        plugins[0].path.should.equal('/lyra/node_modules/@lyra/default-layout')
        plugins[1].path.should.equal('/lyra/node_modules/@lyra/core')
        plugins[2].path.should.equal('/node_modules/@lyra/strawberry')
        plugins[3].path.should.equal('/node_modules/lyra-plugin-rebeltastic')
        plugins[4].path.should.equal('/lyra/app')
      })
    })
  })

  it('can resolve parts for a basic setup', () => {
    mockFs(getBasicTree())
    return resolveParts(opts).then(res => {
      const settings = res.definitions['part:@lyra/default-layout/settingsPane']
      settings.path.should.equal('/lyra/node_modules/@lyra/default-layout')

      const tool = res.implementations['part:@lyra/default-layout/tool']
      tool.should.have.length(2)
      tool[0].should.eql({
        plugin: 'instagram',
        path:
          '/lyra/node_modules/lyra-plugin-instagram/lib/components/InstagramTool'
      })

      const main = res.implementations['part:@lyra/core/root']
      main.should.have.length(1)
      main[0].should.eql({
        plugin: '@lyra/default-layout',
        path: '/lyra/node_modules/@lyra/default-layout/lib/components/Root'
      })

      const comments = res.implementations['part:instagram/commentsList']
      comments[0].should.eql({
        plugin: 'instagram',
        path:
          '/lyra/node_modules/lyra-plugin-instagram/lib/components/CommentsList'
      })
    })
  })

  it('resolves plugins as well as parts', () => {
    mockFs(getBasicTree())
    return resolveParts(opts).then(res => {
      res.plugins.should.have.length(4)
      res.plugins
        .map(plugin => plugin.path)
        .should.eql([
          '/lyra/node_modules/@lyra/default-layout',
          '/lyra/node_modules/@lyra/core',
          '/lyra/node_modules/lyra-plugin-instagram',
          '/lyra'
        ])
    })
  })

  it('can resolve parts synchronously', () => {
    mockFs(getBasicTree())

    const res = resolveParts(syncOpts)
    res.plugins.should.have.length(4)
    res.plugins
      .map(plugin => plugin.path)
      .should.eql([
        '/lyra/node_modules/@lyra/default-layout',
        '/lyra/node_modules/@lyra/core',
        '/lyra/node_modules/lyra-plugin-instagram',
        '/lyra'
      ])
  })

  it('doesnt try to look up the same location twice', () => {
    mockFs(getScopedPluginsTree())
    return resolveParts(opts).catch(err => {
      err.locations
        .some(
          (location, index) => err.locations.indexOf(location, index + 1) !== -1
        )
        .should.equal(false)
    })
  })

  it('resolves path to "compiled" path for node_modules, "source" for plugins', () => {
    mockFs(getMixedPluginTree())
    return resolveParts(opts).then(res => {
      res.implementations['part:@lyra/default-layout/tool'][0].should.eql({
        plugin: 'foo',
        path: '/lyra/plugins/foo/src/File'
      })

      res.implementations['part:@lyra/default-layout/tool'][1].should.eql({
        plugin: 'instagram',
        path:
          '/lyra/node_modules/lyra-plugin-instagram/lib/components/InstagramTool'
      })
    })
  })

  it('resolves path to "compiled" if "useCompiledPaths"-option is set to true', () => {
    mockFs(getMixedPluginTree())
    return resolveParts(Object.assign({}, opts, {useCompiledPaths: true})).then(
      res => {
        res.implementations['part:@lyra/default-layout/tool'][0].should.eql({
          plugin: 'foo',
          path: '/lyra/plugins/foo/lib/File'
        })

        res.implementations['part:@lyra/default-layout/tool'][1].should.eql({
          plugin: 'instagram',
          path:
            '/lyra/node_modules/lyra-plugin-instagram/lib/components/InstagramTool'
        })
      }
    )
  })

  it('treats dot-paths as relative to lyra.json, absolute as absolute', () => {
    mockFs(getPathAlternatives())
    return resolveParts(opts).then(res => {
      res.implementations['part:foo/relative'][0].should.eql({
        plugin: 'foo',
        path: '/lyra/plugins/foo/src/relative/Path.js'
      })

      res.implementations['part:foo/absolute'][0].should.eql({
        plugin: 'foo',
        path: '/absolute/path/to/File.js'
      })

      res.implementations['part:foo/dot-path'][0].should.eql({
        plugin: 'foo',
        path: '/lyra/plugins/foo/locale/en-us.json'
      })
    })
  })

  it('late-defined plugins assign themselves to the start of the fulfillers list', () => {
    mockFs(getMixedPluginTree())
    return resolveParts(opts).then(res => {
      const fulfillers = res.implementations['part:instagram/commentsList']
      fulfillers.should.have.length(2)
      fulfillers[0].should.eql({
        plugin: 'foo',
        path: '/lyra/plugins/foo/src/InstaComments'
      })
    })
  })

  it('resolves multi-fulfiller parts correctly', () => {
    mockFs(getMultiTree())
    return resolveParts(opts).then(res => {
      res.definitions.should.have.property('part:@lyra/base/absolute')
      res.implementations.should.have.property('part:@lyra/base/absolute')
      res.implementations['part:@lyra/base/absolute'].should.have.length(2)
    })
  })

  it('handles style parts as regular parts', () => {
    mockFs(getStyleTree())
    return resolveParts(opts).then(res => {
      res.implementations['part:@lyra/default-layout/header-style'].should.eql([
        {
          path:
            '/lyra/node_modules/lyra-plugin-screaming-dev-badge/css/scream.css',
          plugin: 'screaming-dev-badge'
        },
        {
          path: '/lyra/node_modules/lyra-plugin-material-design/css/header.css',
          plugin: 'material-design'
        },
        {
          path: '/lyra/node_modules/@lyra/default-layout/css/header.css',
          plugin: '@lyra/default-layout'
        }
      ])
    })
  })

  it('allows a part to both implement a part and define a new one', () => {
    mockFs(getStyleOverriderTree())
    return resolveParts(opts).then(res => {
      res.definitions.should.have.property('part:foo/button-style')
      res.definitions.should.have.property('part:foo/button-default-style')

      res.implementations.should.have.property('part:foo/button-style')
      res.implementations.should.have.property('part:foo/button-default-style')
    })
  })

  it('does not allow a non-abstract part to be implemented by others', () => {
    mockFs(getNonAbstractPartTree())
    return resolveParts(opts).should.be.rejectedWith(Error, 'both define part')
  })

  it('should include parts defined in base manifest', () => {
    mockFs(getRootLevelPartsTree())
    return resolveParts(opts).then(res => {
      res.definitions.should.have.property('part:@lyra/config/schema')
      res.definitions['part:@lyra/config/schema'].path.should.eql('/lyra')

      res.implementations.should.have.property('part:@lyra/config/schema')
      res.implementations['part:@lyra/config/schema'][0].path.should.eql(
        path.join('/lyra', 'schema', 'schema.js')
      )

      const last = res.plugins[res.plugins.length - 1]
      last.name.should.eql('(project root)')
      last.path.should.eql('/lyra')
    })
  })

  it('should treat base manifest parts as most significant', () => {
    mockFs(getRootLevelPartsTree({}))
    return resolveParts(opts).then(res => {
      res.definitions.should.have.property('part:@lyra/core/root')
      res.definitions['part:@lyra/core/root'].plugin.should.eql('@lyra/core')

      res.implementations.should.have.property('part:@lyra/core/root')
      res.implementations['part:@lyra/core/root'][0].path.should.eql(
        '/lyra/myRootComponent.js'
      )
    })
  })

  it('should be able to find project root synchronously by looking for `root` prop', () => {
    mockFs(getResolutionOrderFixture({chosenMethod: 'subNodeModules'}))

    const rootPath = resolveProjectRoot({
      basePath:
        '/lyra/node_modules/lyra-plugin-foo/node_modules/lyra-plugin-bar',
      sync: true
    })

    rootPath.should.eql('/lyra')
  })

  it('should resolve project root if option is passed', () => {
    mockFs(getResolutionOrderFixture({chosenMethod: 'subNodeModules'}))

    return resolveParts({
      basePath:
        '/lyra/node_modules/lyra-plugin-foo/node_modules/lyra-plugin-bar',
      resolveProjectRoot: true
    }).then(parts => {
      parts.plugins[parts.plugins.length - 1].path.should.eql('/lyra')
    })
  })

  it('can resolve relative paths as plugins', () => {
    mockFs(getParentDirTree())

    return resolveParts({basePath: '/lyra/app'}).then(parts => {
      parts.plugins[3].should.include.keys({
        name: 'my-parent-plugin',
        path: '/lyra/my-parent-plugin',
        manifest: {
          parts: [
            {
              name: 'part:my-parent-plugin/foo/bar',
              path: 'foobar.js'
            }
          ]
        }
      })

      parts.implementations['part:my-parent-plugin/foo/bar'][0].should.eql({
        plugin: 'my-parent-plugin',
        path: '/lyra/my-parent-plugin/foobar.js'
      })
    })
  })
})

function shouldHaveThrown() {
  assert.fail(
    'Result',
    'Error',
    'Test should have fail, instead succeeded',
    '!='
  )
}
