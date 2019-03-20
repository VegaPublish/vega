import urlForHotspotImage from '../src/urlForImage'
import {
  uncroppedImage,
  croppedImage,
  noHotspotImage,
  materializedAssetWithCrop
} from './fixtures'

describe('urlForHotspotImage', () => {
  test('does not crop when no crop is required', () => {
    expect(
      urlForHotspotImage({
        source: uncroppedImage(),
        dataset: 'production',
        apiHost: 'https://lyra.api',
      })
    ).toBe(
      'https://lyra.api/images/production/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg'
    )
  })

  test('does does not crop, but limits size when only width dimension is specified', () => {
    expect(
      urlForHotspotImage({
        source: uncroppedImage(),
        dataset: 'production',
        apiHost: 'https://lyra.api',
        width: 100
      })
    ).toBe(
      'https://lyra.api/images/production/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg?w=100'
    )
  })

  test('does does not crop, but limits size when only height dimension is specified', () => {
    expect(
      urlForHotspotImage({
        source: uncroppedImage(),
        dataset: 'production',
        apiHost: 'https://lyra.api',
        height: 100
      })
    ).toBe(
      'https://lyra.api/images/production/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg?h=100'
    )
  })

  test('a tall crop is centered on the hotspot', () => {
    expect(
      urlForHotspotImage({
        source: uncroppedImage(),
        dataset: 'production',
        apiHost: 'https://lyra.api',
        width: 30,
        height: 100
      })
    ).toBe(
      'https://lyra.api/images/production/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg?rect=150,0,900,3000&w=30&h=100'
    )
  })

  test('a wide crop is centered on the hotspot', () => {
    expect(
      urlForHotspotImage({
        source: uncroppedImage(),
        dataset: 'production',
        apiHost: 'https://lyra.api',
        width: 100,
        height: 30
      })
    ).toBe(
      'https://lyra.api/images/production/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg?rect=0,525,2000,600&w=100&h=30'
    )
  })

  test('a crop with identical aspect and no specified crop is not cropped', () => {
    expect(
      urlForHotspotImage({
        source: uncroppedImage(),
        dataset: 'production',
        apiHost: 'https://lyra.api',
        width: 200,
        height: 300
      })
    ).toBe(
      'https://lyra.api/images/production/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg?w=200&h=300'
    )
  })

  test('respects the crop, even when no explicit crop is asked for', () => {
    expect(
      urlForHotspotImage({
        source: croppedImage(),
        dataset: 'production',
        apiHost: 'https://lyra.api'
      })
    ).toBe(
      'https://lyra.api/images/production/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg?rect=200,300,1600,2400'
    )
  })

  test('a tall crop is centered on the hotspot and constrained within the image crop', () => {
    expect(
      urlForHotspotImage({
        source: croppedImage(),
        dataset: 'production',
        apiHost: 'https://lyra.api',
        width: 30,
        height: 100
      })
    ).toBe(
      'https://lyra.api/images/production/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg?rect=240,300,720,2400&w=30&h=100'
    )
  })

  test('ignores the image crop if caller specifies another', () => {
    expect(
      urlForHotspotImage({
        source: croppedImage(),
        rect: {left: 10, top: 20, width: 30, height: 40},
        dataset: 'production',
        apiHost: 'https://lyra.api',
        width: 30,
        height: 100
      })
    ).toBe(
      'https://lyra.api/images/production/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg?rect=10,20,30,40&w=30&h=100'
    )
  })

  test('gracefully handles a non-hotspot image', () => {
    expect(
      urlForHotspotImage({
        source: noHotspotImage(),
        dataset: 'production',
        apiHost: 'https://lyra.api',
        height: 100
      })
    ).toBe(
      'https://lyra.api/images/production/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg?h=100'
    )
  })

  test('gracefully handles materialized asset', () => {
    expect(
      urlForHotspotImage({
        source: materializedAssetWithCrop(),
        dataset: 'production',
        apiHost: 'https://lyra.api',
        height: 100
      })
    ).toBe(
      'https://lyra.api/images/production/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg?rect=200,300,1600,2400&h=100'
    )
  })
})
