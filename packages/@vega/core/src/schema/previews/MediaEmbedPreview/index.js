import React from 'react'
import PropTypes from 'prop-types'
import urlParser from 'js-video-url-parser'

// function resolveTwitchEmbedUrl(media) {
//   if (media.mediaType === 'stream') {
//     return `https://player.twitch.tv/?channel=${media.channel}`
//   }
//   if (media.mediaType === 'video') {
//     return `https://player.twitch.tv/?autoplay=false&video=${media.id}`
//   }
//   if (media.mediaType === 'clip') {
//     return `https://clips.twitch.tv/embed&autoplay=false&clip=${media.id}`
//   }
//   return null
// }

function getEmbedCode(value) {
  const media = value && value.url ? urlParser.parse(value.url) : ''

  if (!media) {
    return <span />
  }

  switch (media.provider) {
    case 'youtube': {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${media.id}?rel=0`}
          frameBorder="0"
          allowFullScreen
        />
      )
    }

    case 'vimeo': {
      return (
        <iframe
          src={`https://player.vimeo.com/video/${media.id}`}
          width="640"
          frameBorder="0"
          webkitallowfullscreen
          mozallowfullscreen
          allowFullScreen
        />
      )
    }

    // Disable Twitch for the time being due to rate limiting and the need for a token
    // case 'twitch': {
    //   const url = resolveTwitchEmbedUrl(media)
    //   return url ? (
    //     <iframe
    //       src={url}
    //       frameBorder="0"
    //       allowFullScreen="true"
    //       scrolling="no"
    //       width="320"
    //     />
    //   ) : (
    //     <span>Unsupported Twitch URL: {value.url}</span>
    //   )
    // }

    default: {
      return <span>Unsupported service: {media.provider}</span>
    }
  }
}

// eslint-disable-next-line react/require-optimization
export default class MediaEmbedPreview extends React.Component {
  static propTypes = {
    value: PropTypes.object //eslint-disable-line react/forbid-prop-types
  }

  render() {
    const {value} = this.props
    return <div style={{minHeight: '2em'}}>{getEmbedCode(value)}</div>
  }
}
