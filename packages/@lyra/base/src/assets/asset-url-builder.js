const lyraUrlMatch = /^https?:\/\/cdn.lyra.\w+\/images\//

export default function assetUrlBuilder(url, options) {
  const {width, height, fit} = options

  if (!lyraUrlMatch.test(url)) {
    return url
  }

  if (url.includes('?')) {
    // todo: this is an lyra cdn url that already has parameters specified
    // Consider merging with options instead of just bypassing
    return url
  }

  const defaultFit = width === height ? 'crop' : 'clip'
  const params = [
    width && `w=${width}`,
    height && `h=${height}`,
    `fit=${fit ? fit : defaultFit}`,
    'q=85'
  ]
    .filter(Boolean)
    .join('&')

  return `${url}?${params}`
}
