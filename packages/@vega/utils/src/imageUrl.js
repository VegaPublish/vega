import client from 'part:@lyra/base/client'
import imageUrlBuilder from '@lyra/image-url'
let builder = null

export function urlFor(source, options = {}) {
  if (!builder) {
    // Lazy init of builder in hoping that client has the correct dataset
    builder = imageUrlBuilder(client)
  }
  return builder
    .image(source)
    .width(options.size || 100)
    .url()
}
