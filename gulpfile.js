/* eslint-disable import/no-commonjs */
// Note: Node 6 compat, please!
const path = require('path')
const gulp = require('gulp')
const newer = require('gulp-newer')
const babel = require('gulp-babel')
const watch = require('gulp-watch')
const gutil = require('gulp-util')
const filter = require('gulp-filter')
const plumber = require('gulp-plumber')
const through = require('through2')
const chalk = require('chalk')
const childProcess = require('child_process')

const isWindows = /^win/.test(process.platform)
const scripts = [
  './packages/@vega/*/src/**/*.js',
  './packages/@lyra/*/src/**/*.js'
]
const assets = ['./packages/@vega/*/src/**/*', './packages/@lyra/*/src/**/*']
const srcOpts = {base: 'packages'}

const getProjectEnv = projectPath => {
  const npmPath = path.join(projectPath, 'node_modules', '.bin')
  /* eslint-disable no-process-env */
  const paths = [npmPath]
    .concat(process.env.PATH.split(path.delimiter))
    .filter(Boolean)
  return Object.assign({}, process.env, {
    PATH: paths.join(path.delimiter)
  })
  /* eslint-enable no-process-env */
}

let srcEx
let srcRootEx
let libFragment

if (path.win32 === path) {
  srcEx = /(@(vega|lyra)\\[^\\]+)\\src\\/
  libFragment = '$1\\lib\\'
} else {
  srcEx = new RegExp('(@(vega|lyra)/[^/]+)/src/')
  libFragment = '$1/lib/'
}

const mapToDest = orgPath => {
  const outPath = orgPath
    .replace(srcEx, libFragment)
    .replace(srcRootEx, libFragment)

  return outPath
}

const dest = 'packages'

gulp.task('default', ['build'])

gulp.task('build', () => {
  const assetFilter = filter(['**/*.js'], {restore: true})

  return gulp
    .src(assets, srcOpts)
    .pipe(plumber({errorHandler: err => gutil.log(err.stack)}))
    .pipe(newer({map: mapToDest}))
    .pipe(assetFilter)
    .pipe(
      through.obj((file, enc, callback) => {
        gutil.log('Compiling', `'${chalk.cyan(file.path)}'...`)
        callback(null, file)
      })
    )
    .pipe(babel())
    .pipe(assetFilter.restore)
    .pipe(
      through.obj((file, enc, callback) => {
        file._path = file.path
        file.path = mapToDest(file.path)
        callback(null, file)
      })
    )
    .pipe(gulp.dest(dest))
})

gulp.task('watch-js', () => {
  return gulp
    .src(scripts, srcOpts)
    .pipe(plumber({errorHandler: err => gutil.log(err.stack)}))
    .pipe(
      through.obj((file, enc, callback) => {
        file._path = file.path
        file.path = mapToDest(file.path)
        callback(null, file)
      })
    )
    .pipe(newer(dest))
    .pipe(
      through.obj((file, enc, callback) => {
        gutil.log('Compiling', `'${chalk.cyan(file._path)}'...`)
        callback(null, file)
      })
    )
    .pipe(babel())
    .pipe(gulp.dest(dest))
})

gulp.task('watch-assets', () => {
  return gulp
    .src(assets, srcOpts)
    .pipe(filter(['**/*.*', '!**/*.js']))
    .pipe(plumber({errorHandler: err => gutil.log(err.stack)}))
    .pipe(
      through.obj((file, enc, callback) => {
        file._path = file.path
        file.path = mapToDest(file.path)
        callback(null, file)
      })
    )
    .pipe(newer(dest))
    .pipe(
      through.obj((file, enc, callback) => {
        gutil.log('Copying', `'${chalk.cyan(file._path)}'...`)
        callback(null, file)
      })
    )
    .pipe(gulp.dest(dest))
})

gulp.task('watch', ['watch-js', 'watch-assets'], callback => {
  watch(scripts, {debounceDelay: 200}, () => {
    gulp.start('watch-js')
  })

  watch(assets, {debounceDelay: 200}, () => {
    gulp.start('watch-assets')
  })
})

const STUDIOS = [
  {name: 'test-studio', port: '1235'},
  {name: 'dev-studio', port: '1234'},
  {name: 'wayne-state-studio', port: '1236'}
]

STUDIOS.forEach(studio => {
  gulp.task(studio.name, ['watch-js', 'watch-assets'], cb => {
    watch(scripts, {debounceDelay: 200}, () => {
      gulp.start('watch-js')
    })

    watch(assets, {debounceDelay: 200}, () => {
      gulp.start('watch-assets')
    })

    const projectPath = path.join(__dirname, 'packages', studio.name)
    const proc = childProcess.spawn(
      'lyra',
      ['start', '--host', '0.0.0.0', '--port', studio.port],
      {
        shell: isWindows,
        cwd: projectPath,
        env: getProjectEnv(projectPath)
      }
    )

    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
  })
})
