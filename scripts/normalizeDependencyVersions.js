/* eslint-disable no-sync, no-console, id-length */
const fs = require('fs')
const chalk = require('chalk')
const semver = require('semver')
const readPackages = require('./readPackages')

const stripRange = version => version.replace(/^[~^]/, '')
const sortRanges = ranges =>
  ranges.sort((a, b) => semver.compare(stripRange(a), stripRange(b)))

const pkgsWithDeps = readPackages().map(pkg => ({
  ...pkg,
  deps: Object.assign(
    {},
    pkg.manifest.dependencies || {},
    pkg.manifest.devDependencies || {}
  )
}))

const versionRanges = {}
const fixable = {}

pkgsWithDeps.forEach(pkgWithDeps => {
  if (!pkgWithDeps.name) {
    return
  }

  Object.keys(pkgWithDeps.deps).forEach(depName => {
    const version = pkgWithDeps.deps[depName]
    versionRanges[depName] = versionRanges[depName] || {}
    versionRanges[depName][version] = versionRanges[depName][version] || []
    versionRanges[depName][version].push(pkgWithDeps.name)
  })
})

Object.keys(versionRanges).forEach(depName => {
  const versions = Object.keys(versionRanges[depName])
  if (versions.length === 1) {
    return
  }

  const plain = versions
    .map(stripRange)
    .filter(version => /^\d+\.\d+\.\d+/.test(version))
    .sort(semver.rcompare)

  const greatestVersion = plain[0]
  const greatestMajor = `${semver.major(greatestVersion)}.0.0`
  const greatestRange = `^${greatestVersion}`

  console.log('')
  console.log(chalk.cyan(depName))

  sortRanges(versions).forEach(range => {
    const packages = versionRanges[depName][range]

    const isFixable = semver.satisfies(stripRange(range), `^${greatestMajor}`)
    const isGreatest = range === greatestRange
    const sign = isGreatest || isFixable ? chalk.green('✔') : chalk.red('✖')

    console.log(`  ${chalk[isGreatest ? 'green' : 'yellow'](range)}:`)
    console.log(`    ${sign} ${packages.join(`\n    ${sign} `)}`)

    if (range === greatestRange || !isFixable) {
      return
    }

    packages.forEach(pkgName => {
      fixable[pkgName] = fixable[pkgName] || []
      fixable[pkgName].push({depName, version: greatestRange})
    })
  })
})

const fixablePackages = Object.keys(fixable)

fixablePackages.forEach(pkgName => {
  const pkgWithDeps = pkgsWithDeps.find(
    pkgWitDeps => pkgWitDeps.name === pkgName
  )
  const toFix = fixable[pkgName]
  const manifestPath = pkgWithDeps.path

  const manifest = require(manifestPath)
  toFix.forEach(dep => {
    const depSection = (manifest.dependencies || {})[dep.depName]
      ? manifest.dependencies
      : manifest.devDependencies

    depSection[dep.depName] = dep.version
  })

  const json = `${JSON.stringify(manifest, null, 2)}\n`
  fs.writeFileSync(manifestPath, json, 'utf-8')
})

if (fixablePackages.length > 0) {
  console.log('')
  console.log(
    [
      'Updated version ranges for %d packages,',
      'you might want to run "npm run bootstrap"',
      'and run some tests before pushing changes'
    ].join(' '),
    fixablePackages.length
  )
}
