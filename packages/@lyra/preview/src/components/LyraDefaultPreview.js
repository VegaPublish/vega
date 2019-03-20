import PropTypes from 'prop-types'
import React from 'react'
import assetUrlBuilder from 'part:@lyra/base/asset-url-builder'
import imageUrlBuilder from '@lyra/image-url'
import PreviewComponentCard from 'part:@lyra/components/previews/card'
import PreviewComponentDefault from 'part:@lyra/components/previews/default'
import PreviewComponentDetail from 'part:@lyra/components/previews/detail'
import PreviewComponentInline from 'part:@lyra/components/previews/inline'
import PreviewComponentMedia from 'part:@lyra/components/previews/media'
import PreviewComponentBlock from 'part:@lyra/components/previews/block'
import PreviewComponentBlockImage from 'part:@lyra/components/previews/block-image'
import lyraClient from 'part:@lyra/base/client'

function getImageUrlBuilder() {
  return imageUrlBuilder(lyraClient)
}

const previewComponentMap = {
  default: PreviewComponentDefault,
  card: PreviewComponentCard,
  media: PreviewComponentMedia,
  detail: PreviewComponentDetail,
  inline: PreviewComponentInline,
  block: PreviewComponentBlock
}

function extractUploadState(value) {
  if (!value || typeof value !== 'object') {
    return {_upload: null, value}
  }
  const {_upload, ...rest} = value
  return {_upload, value: rest}
}

export default class LyraDefaultPreview extends React.PureComponent {
  static propTypes = {
    layout: PropTypes.oneOf(Object.keys(previewComponentMap)),
    value: PropTypes.object,
    type: PropTypes.shape({
      title: PropTypes.string
    }).isRequired
  }

  renderMedia = options => {
    // This functions exists because the previews provides options
    // for the rendering of the media (dimensions)
    const {dimensions} = options
    const {value} = this.props
    const {media} = value

    // Handle lyra image
    return (
      <img
        alt={value.title}
        src={getImageUrlBuilder()
          .image(media)
          .width(dimensions.width || 100)
          .height(dimensions.height || 100)
          .fit(dimensions.fit)
          .url()}
      />
    )
  }

  renderImageUrl = options => {
    // Legacy support for imageUrl
    const {dimensions} = options
    const {value} = this.props
    const imageUrl = value.imageUrl
    if (imageUrl) {
      const assetUrl = assetUrlBuilder(imageUrl.split('?')[0], dimensions)
      return <img src={assetUrl} alt={value.title} />
    }
    return undefined
  }

  renderIcon = options => {
    const {type} = this.props
    const Icon = type.icon
    return Icon && <Icon className="lyra-studio__preview-fallback-icon" />
  }

  resolveMedia = () => {
    const {value} = this.props
    const {media} = value

    if (typeof media === 'function' || React.isValidElement(media)) {
      return media
    }

    // Legacy support for imageUrl
    if (value.imageUrl) {
      return this.renderImageUrl
    }

    // Handle lyra image
    if (media && media.asset) {
      return this.renderMedia
    }

    // Render fallback icon
    return this.renderIcon
  }

  render() {
    const {layout, ...rest} = this.props

    let PreviewComponent = previewComponentMap.hasOwnProperty(layout)
      ? previewComponentMap[layout]
      : previewComponentMap.default

    // TODO: Bjoerge: Check for image type with "is()"
    if (
      layout === 'block' &&
      this.props.type &&
      this.props.type.name === 'image'
    ) {
      PreviewComponent = PreviewComponentBlockImage
    }

    const {_upload, value} = extractUploadState(this.props.value)

    const item = _upload
      ? {
          ...value,
          imageUrl: _upload.previewImage,
          title:
            value.title || (_upload.file && _upload.file.name) || 'Uploading…'
        }
      : value

    if (!item) {
      return (
        <PreviewComponent {...rest} progress={_upload && _upload.progress} />
      )
    }

    const media = this.resolveMedia()

    return (
      <PreviewComponent
        {...rest}
        title={item.title}
        subtitle={item.subtitle}
        description={item.description}
        media={media}
        progress={_upload && _upload.progress}
      />
    )
  }
}
