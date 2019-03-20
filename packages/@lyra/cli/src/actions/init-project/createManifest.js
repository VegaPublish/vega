import sortObject from 'deep-sort-object'

const manifestPropOrder = [
  'name',
  'private',
  'version',
  'description',
  'main',
  'author',
  'license',
  'scripts',
  'keywords',
  'dependencies',
  'devDependencies'
]

function getCommonManifest(data) {
  const pkg = {
    name: data.name,
    version: '1.0.0',
    description: data.description,
    author: data.author,
    license: data.license,
    devDependencies: {}
  }

  if (pkg.license === 'UNLICENSED') {
    pkg.private = true
  }

  if (data.gitRemote) {
    pkg.repository = {
      type: 'git',
      url: data.gitRemote
    }
  }

  return pkg
}

export function createPackageManifest(data) {
  const deps = data.dependencies
    ? {dependencies: sortObject(data.dependencies)}
    : {}
  const pkg = Object.assign(
    getCommonManifest(data),
    {
      main: 'package.json',
      keywords: ['lyra'],
      scripts: {
        start: 'lyra start',
        test: 'lyra check'
      }
    },
    deps
  )

  return serializeManifest(pkg)
}

export function createPluginManifest(data, opts = {}) {
  const pkg = Object.assign(getCommonManifest(data), {
    main: 'src/plugin.js',
    scripts: {test: 'echo "Error: no test specified" && exit 1'},
    keywords: ['lyra', 'lyra-plugin'],
    dependencies: {}
  })

  return serializeManifest(pkg)
}

function getLyraPluginManifest(data, {isLyraStyle}) {
  const prefix = data.name.replace(/^lyra-plugin-/, '')
  if (isLyraStyle) {
    return {
      paths: {
        source: './src',
        compiled: './lib'
      },

      parts: [
        {
          name: `part:${prefix}/my-component`,
          path: 'MyComponent.js'
        }
      ]
    }
  }

  return {
    parts: [
      {
        implements: `part:${prefix}/my-component`,
        description:
          'Description for this role. Change `implements` to `name` if it should be non-overridable.',
        path: 'lib/MyComponent.js'
      }
    ]
  }
}

export function createLyraManifest(data, opts) {
  let manifest
  if (opts.isPlugin) {
    manifest = getLyraPluginManifest(data, opts)
  } else {
    manifest = {
      root: true,

      project: {
        name: data.displayName
      },

      api: {
        apiHost: data.apiHost,
        dataset: data.defaultVenueDataset,
        token: data.provisionalToken || undefined
      },

      venues: [{dataset: data.defaultVenueDataset}],

      plugins: [
        '@lyra/base',
        '@lyra/components',
        '@lyra/default-login',
        '@lyra/google-maps-input',
        '@lyra/form-builder',
        '@vega/core',
        '@vega/components',
        '@vega/layout',
        '@vega/theme',
        '@vega/communicator-system',
        '@vega/issues-tool',
        '@vega/tracks-tool',
        '@vega/composer-tool',
        '@vega/submissions-tool',
        '@vega/review-tool',
        '@vega/article-state-tool',
        '@vega/feature-checklist',
        '@vega/feature-declaration',
        '@vega/feature-due-date',
        '@vega/feature-notifier',
        '@lyra/desk-tool'
      ],

      parts: [
        {
          name: 'part:@lyra/base/schema',
          path: './schemas/schema.js'
        }
      ]
    }
  }

  return opts.serialize ? `${JSON.stringify(manifest, null, 2)}\n` : manifest
}

function serializeManifest(src) {
  const props = manifestPropOrder.concat(Object.keys(src))
  const ordered = props.reduce((target, prop) => {
    if (
      typeof src[prop] !== 'undefined' &&
      typeof target[prop] === 'undefined'
    ) {
      target[prop] = src[prop]
    }

    return target
  }, {})

  return `${JSON.stringify(ordered, null, 2)}\n`
}
