import React from 'react'
import {storiesOf} from 'part:@lyra/storybook'
import {withKnobs, color} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'
import styles from './styles/iconStory.css'

// Lyra icons
import CloseIcon from 'part:@lyra/base/close-icon'
import AngleDownIcon from 'part:@lyra/base/angle-down-icon'
import SpinnerIcon from 'part:@lyra/base/spinner-icon'
import HamburgerIcon from 'part:@lyra/base/hamburger-icon'
import UploadIcon from 'part:@lyra/base/upload-icon'
import FormatBoldIcon from 'part:@lyra/base/format-bold-icon'
import FormatItalicIcon from 'part:@lyra/base/format-italic-icon'
import FormatListBulletedIcon from 'part:@lyra/base/format-list-bulleted-icon'
import FormatListNumberedIcon from 'part:@lyra/base/format-list-numbered-icon'
import FormatQuoteIcon from 'part:@lyra/base/format-quote-icon'
import FormatStrikethroughIcon from 'part:@lyra/base/format-strikethrough-icon'
import FormatUnderlinedIcon from 'part:@lyra/base/format-underlined-icon'
import FullscreenIcon from 'part:@lyra/base/fullscreen-icon'
import FullscreenExitIcon from 'part:@lyra/base/fullscreen-exit-icon'
import PlusIcon from 'part:@lyra/base/plus-icon'
import ArrowDropDownIcon from 'part:@lyra/base/arrow-drop-down'
import TrashIcon from 'part:@lyra/base/trash-icon'
import UndoIcon from 'part:@lyra/base/undo-icon'
import VisibilityOffIcon from 'part:@lyra/base/visibility-off-icon'

// Logos
import LyraLogo from 'part:@lyra/base/lyra-logo'
import LyraLogoAlpha from 'part:@lyra/base/lyra-logo-alpha'
import LyraLogoIcon from 'part:@lyra/base/lyra-logo-icon'
import LyraStudioLogo from 'part:@lyra/base/lyra-studio-logo'
import BrandLogo from 'part:@lyra/base/brand-logo?'

function createIconPreview(title, Icon, role) {
  return (
    <li className={styles.lyraIcon}>
      <div className={styles.title}>{title}</div>
      <div className={styles.role}>
        import {Icon.name} from &lsquo;
        {role}
        &lsquo;
      </div>
      <span className={styles.iconPreviewXL}>
        <Icon />
      </span>
      <span className={styles.iconPreviewL}>
        <Icon />
      </span>
      <span className={styles.iconPreviewM}>
        <Icon />
      </span>
      <span className={styles.iconPreviewS}>
        <Icon />
      </span>
      <span className={styles.iconPreviewXS}>
        <Icon />
      </span>
    </li>
  )
}

storiesOf('Icons')
  .addDecorator(withKnobs)
  .add(
    'Icons',
    () => {
      return (
        <ul
          className={styles.lyraIcons}
          style={{
            color: color('color', '#333'),
            backgroundColor: color('background', '#fff')
          }}
        >
          {createIconPreview(
            'Lyra logo',
            LyraLogoIcon,
            'part:@lyra/base/lyra-logo-icon'
          )}
          {createIconPreview('Close', CloseIcon, 'part:@lyra/base/close-icon')}
          {createIconPreview(
            'Angle Down',
            AngleDownIcon,
            'part:@lyra/base/angle-down-icon'
          )}
          {createIconPreview(
            'Spinner',
            SpinnerIcon,
            'part:@lyra/base/spinner-icon'
          )}
          {createIconPreview(
            'Hamburger',
            HamburgerIcon,
            'part:@lyra/base/hamburger-icon'
          )}

          {createIconPreview(
            'Upload',
            UploadIcon,
            'part:@lyra/base/upload-icon'
          )}
          {createIconPreview(
            'Format bold',
            FormatBoldIcon,
            'part:@lyra/base/format-bold-icon'
          )}
          {createIconPreview(
            'Format italic',
            FormatItalicIcon,
            'part:@lyra/base/format-italic-icon'
          )}
          {createIconPreview(
            'Format List (bulleted)',
            FormatListBulletedIcon,
            'part:@lyra/base/format-list-bulleted-icon'
          )}
          {createIconPreview(
            'Format List (numbered)',
            FormatListNumberedIcon,
            'part:@lyra/base/format-list-numbered-icon'
          )}
          {createIconPreview(
            'Format quote',
            FormatQuoteIcon,
            'part:@lyra/base/format-quote-icon'
          )}
          {createIconPreview(
            'Format strikethrough',
            FormatStrikethroughIcon,
            'part:@lyra/base/format-strikethrough-icon'
          )}
          {createIconPreview(
            'Format underlined',
            FormatUnderlinedIcon,
            'part:@lyra/base/format-underlined-icon'
          )}
          {createIconPreview(
            'Fullscreen',
            FullscreenIcon,
            'part:@lyra/base/fullscreen-icon'
          )}
          {createIconPreview(
            'Fullscreen exit',
            FullscreenExitIcon,
            'part:@lyra/base/fullscreen-exit-icon'
          )}
          {createIconPreview('Plus', PlusIcon, 'part:@lyra/base/plus-icon')}
          {createIconPreview(
            'Arrow Drop Down',
            ArrowDropDownIcon,
            'part:@lyra/base/arrow-drop-down'
          )}
          {createIconPreview('Trash', TrashIcon, 'part:@lyra/base/trash-icon')}
          {createIconPreview('Undo', UndoIcon, 'part:@lyra/base/undo-icon')}
          {createIconPreview(
            'Visibility off',
            VisibilityOffIcon,
            'part:@lyra/base/visibility-off-icon'
          )}
        </ul>
      )
    },
    {inline: false}
  )

storiesOf('Logos')
  .addDecorator(withKnobs)
  .add('Lyra', () => {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          color: color('color', '#fff'),
          backgroundColor: color('background', '#f43')
        }}
      >
        <div
          style={{
            position: 'absolute',
            height: '50vh',
            width: '50vw',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Lyra part="part:@lyra/base/lyra-logo" propTables={[LyraLogo]}>
            <LyraLogo />
          </Lyra>
        </div>
      </div>
    )
  })
  .add('Lyra Icon', () => {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          color: color('color', '#fff'),
          backgroundColor: color('background', '#f43')
        }}
      >
        <div
          style={{
            position: 'absolute',
            height: '50vh',
            width: '50vw',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Lyra
            part="part:@lyra/base/lyra-logo-icon"
            propTables={[LyraLogoIcon]}
          >
            <LyraLogoIcon />
          </Lyra>
        </div>
      </div>
    )
  })
  .add('Lyra Alpha', () => {
    return (
      <Lyra part="part:@lyra/base/lyra-logo-alpha" propTables={[LyraLogoAlpha]}>
        <div
          style={{
            height: '100vh',
            display: 'flex',
            color: color('color', '#fff'),
            backgroundColor: color('background', '#f43')
          }}
        >
          <div
            style={{
              position: 'absolute',
              height: '50vh',
              width: '50vw',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <LyraLogoAlpha />
          </div>
        </div>
      </Lyra>
    )
  })

  .add('Brand', () => {
    if (!BrandLogo) {
      return (
        <div>
          No brand logo. Implement <code>part:@lyra/base/brand-logo</code>
        </div>
      )
    }
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          color: color('color', '#fff'),
          backgroundColor: color('background', '#f43')
        }}
      >
        <div
          style={{
            position: 'absolute',
            height: '50vh',
            width: '50vw',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Lyra part="part:@lyra/base/brand-logo" propTables={[BrandLogo]}>
            <BrandLogo />
          </Lyra>
        </div>
      </div>
    )
  })
  .add('Lyra Studio', () => {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          color: color('color', '#fff'),
          backgroundColor: color('background', '#f43')
        }}
      >
        <div
          style={{
            position: 'absolute',
            height: '50vh',
            width: '50vw',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Lyra
            part="part:@lyra/base/lyra-studio-logo"
            propTables={[LyraStudioLogo]}
          >
            <LyraStudioLogo />
          </Lyra>
        </div>
      </div>
    )
  })
