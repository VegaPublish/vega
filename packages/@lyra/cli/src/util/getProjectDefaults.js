import path from 'path'
import fse from 'fs-extra'
import gitConfigLocal from 'gitconfiglocal'
import gitUserInfo from 'git-user-info'
import promiseProps from 'promise-props-recursive'
import {promisify} from 'es6-promisify'

export default (workDir, {isPlugin}) => {
  const cwd = process.cwd()
  const isLyraRoot = workDir === cwd

  return promiseProps({
    author: gitUserInfo(),

    // Don't try to use git remote from main Lyra project for plugins
    gitRemote: isPlugin && isLyraRoot ? '' : resolveGitRemote(cwd),

    // Don't try to guess plugin name if we're initing from Lyra root
    projectName: isPlugin && isLyraRoot ? '' : path.basename(cwd),

    // If we're initing a plugin, don't use description from Lyra readme
    description: getProjectDescription({isLyraRoot, isPlugin, outputDir: cwd})
  })
}

const getGitConfig = promisify(gitConfigLocal)
function resolveGitRemote(cwd) {
  return fse
    .stat(path.join(cwd, '.git'))
    .then(() => getGitConfig(cwd))
    .then(cfg => cfg.remote && cfg.remote.origin && cfg.remote.origin.url)
    .catch(() => null)
}

async function getProjectDescription({isLyraRoot, isPlugin, outputDir}) {
  const tryResolve = isLyraRoot && !isPlugin
  if (!tryResolve) {
    return Promise.resolve('')
  }

  // Try to grab a project description from a standard Github-generated readme
  try {
    const readmePath = path.join(outputDir, 'README.md')
    const readme = await fse.readFile(readmePath, {encoding: 'utf8'})
    const match = readme.match(/^# .*?\n+(\w.*?)(?:$|\n)/)
    return ((match && match[1]) || '').replace(/\.$/, '') || ''
  } catch (err) {
    return ''
  }
}
