import React from 'react'
import PropTypes from 'prop-types'
import Button from 'part:@lyra/components/buttons/default'
import {
  ColorWrap,
  Checkboard,
  Saturation,
  Hue,
  Alpha
} from 'react-color/lib/components/common'
import ColorPickerFields from './ColorPickerFields'
import TrashIcon from 'part:@lyra/base/trash-icon'
import styles from './ColorPicker.css'

const ColorPicker = ({
  width,
  rgb,
  hex,
  hsv,
  hsl,
  onChange,
  onUnset,
  disableAlpha,
  renderers
}) => {
  return (
    <div style={{width}}>
      <div className={styles.saturation}>
        <div className={styles.saturationInner}>
          <Saturation is="Saturation" onChange={onChange} hsl={hsl} hsv={hsv} />
        </div>
      </div>
      <div className={styles.hue}>
        <Hue
          is="Hue"
          hsl={hsl}
          onChange={onChange}
          style={{
            radius: '2px',
            shadow:
              'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)'
          }}
        />
      </div>
      {!disableAlpha && (
        <div className={styles.alpha}>
          <Alpha
            is="Alpha"
            rgb={rgb}
            hsl={hsl}
            renderers={renderers}
            onChange={onChange}
            style={{
              radius: '2px',
              shadow:
                'inset 0 0 0 1px rgba(0,0,0,.15), inset 0 0 4px rgba(0,0,0,.25)'
            }}
          />
        </div>
      )}
      <div className={styles.controls}>
        <div className={styles.preview}>
          <div className={styles.checkboard}>
            <Checkboard />
          </div>
          <div
            className={styles.color}
            style={{
              backgroundColor: `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`
            }}
          />
        </div>
        <div className={styles.fields}>
          <ColorPickerFields
            rgb={rgb}
            hsl={hsl}
            hex={hex}
            onChange={onChange}
            disableAlpha={disableAlpha}
          />
          <Button
            onClick={onUnset}
            title="Delete color"
            icon={TrashIcon}
            color="danger"
          />
        </div>
      </div>
    </div>
  )
}

ColorPicker.propTypes = {
  width: PropTypes.string,
  hex: PropTypes.string,
  hsl: PropTypes.object,
  hsv: PropTypes.object,
  rgb: PropTypes.object,
  onChange: PropTypes.func,
  disableAlpha: PropTypes.bool,
  renderers: PropTypes.func,
  onUnset: PropTypes.func
}

ColorPicker.defaultProps = {
  disableAlpha: false
}

export default ColorWrap(ColorPicker)
