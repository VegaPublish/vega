import {deburr, kebabCase} from 'lodash'

function mkSeqUniq(existing, id) {
  if (!existing.includes(id)) {
    return id
  }
  const [base, suffix = 0] = id.split('.')
  return mkSeqUniq(existing, `${base}.${Number(suffix) + 1}`)
}

export function prepareProviders(providers) {
  return providers.reduce((result, provider) => {
    const id = mkSeqUniq(
      result.map(p => p.id),
      kebabCase(deburr((provider.title || 'Unnamed provider').trim()))
    )
    return result.concat({
      id: id,
      ...provider
    })
  }, [])
}
