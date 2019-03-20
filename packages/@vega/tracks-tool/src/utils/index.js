// Filter list of articles array based on track, stage and issue options
export function filterArticles(articles, options = {}) {
  const {track, stage, issue} = options
  const articleId = options.articleId || options.article
  return (
    (articles || [])
      // eslint-disable-next-line complexity
      .filter(article => {
        const trackNameSatisified = track
          ? article.track && article.track._id == track
          : true
        const stageNameSatisified = stage
          ? article.stage && article.stage._id == stage
          : true
        const issueIdSatisified = issue
          ? !!(article.issues || []).find(iss => iss._id == issue)
          : true
        const articleIdSatisified = articleId ? article._id == articleId : true

        if (
          trackNameSatisified &&
          stageNameSatisified &&
          issueIdSatisified &&
          articleIdSatisified
        ) {
          return true
        }
        return false
      })
  )
}

// Only stages present in one or more tracks will be returned
export function stagesSuperset(tracks) {
  const stages = {}
  tracks.forEach(track => {
    return track.trackStages.forEach(trackStage => {
      stages[trackStage.stage._id] = trackStage.stage
    })
  })
  return Object.values(stages).sort((stageA, stageB) => {
    return stageA.order - stageB.order
  })
}

// Return array of objects
// Each object is labeled with track and contains articles in that track
export function groupArticlesByTrack(articles) {
  const hasTrack = article => {
    return !!article.track
  }
  const groupedArticles = []
  articles.filter(hasTrack).forEach(article => {
    const group = groupedArticles.find(entry => {
      return (
        article.track && entry.track && article.track.name == entry.track.name
      )
    }) || {
      track: article.track,
      articles: []
    }
    group.articles.push(article)
    if (group.articles.length == 1) {
      groupedArticles.push(group)
    }
  })
  return groupedArticles
}
