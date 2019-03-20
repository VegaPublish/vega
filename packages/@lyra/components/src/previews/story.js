/* eslint-disable react/no-multi-comp */
import React from 'react'
import {storiesOf} from 'part:@lyra/storybook'
import DefaultPreview from 'part:@lyra/components/previews/default'
import DetailPreview from 'part:@lyra/components/previews/detail'
import InlinePreview from 'part:@lyra/components/previews/inline'
import MediaPreview from 'part:@lyra/components/previews/media'
import CardPreview from 'part:@lyra/components/previews/card'
import BlockPreview from 'part:@lyra/components/previews/block'
import BlockImagePreview from 'part:@lyra/components/previews/block-image'
import {
  withKnobs,
  boolean,
  number,
  text,
  select
} from 'part:@lyra/storybook/addons/knobs'
import Lyra from 'part:@lyra/storybook/addons/lyra'
import WarningIcon from 'part:@lyra/base/warning-icon'
import LinkIcon from 'part:@lyra/base/link-icon'

const renderMedia = dimensions => {
  return <img src="http://www.fillmurray.com/300/300" alt="test" />
}

const renderStatus = options => {
  return (
    <span>
      Status <LinkIcon /> <WarningIcon />
    </span>
  )
}

const renderTitle = options => {
  return (
    <span>
      This <span style={{color: 'green'}}>is</span> a <strong>title</strong>
      &nbsp;in the layout {options.layout}
    </span>
  )
}

const renderSubtitle = options => {
  return (
    <span>
      This is a{' '}
      <strong style={{color: 'red'}}>
        <WarningIcon />
        subtitle
      </strong>
    </span>
  )
}

const renderDescription = options => {
  return (
    <span>
      This is the{' '}
      <strong style={{color: 'red'}}>
        <WarningIcon />
        description
      </strong>
    </span>
  )
}

const renderCustomChildren = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '0',
          right: '0'
        }}
      >
        <div
          style={{
            position: 'absolute',
            fontSize: '10px',
            textTransform: 'uppercase',
            top: '0',
            right: '0',
            fontWeight: '700',
            boxShadow: '0 0 5px rgba(0,0,0,0.2)',
            backgroundColor: 'yellow',
            padding: '0.2em 3em',
            transform: 'translate(28%, 43%) rotate(45deg)'
          }}
        >
          New
        </div>
      </div>
    </div>
  )
}

const style = {
  height: '100vh',
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#eee',
  padding: '1em'
}

const innerStyle = {
  border: '1px dotted #ccc',
  width: '500px'
}

const centered = function(storyFn) {
  return (
    <div style={style}>
      <div style={innerStyle}>{storyFn()}</div>
    </div>
  )
}

const options = {
  functions: 'Functions',
  strings: 'Strings',
  elements: 'Element'
}

storiesOf('Previews')
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const propType = select('Type of props', options, 'strings')

    if (propType === 'functions') {
      return (
        <Lyra
          part="part:@lyra/components/previews/default"
          propTables={[DefaultPreview]}
        >
          <DefaultPreview
            title={renderTitle}
            subtitle={renderSubtitle}
            description={renderDescription}
            status={renderStatus}
            media={renderMedia}
            isPlaceholder={boolean('placeholder (prop)', false)}
            date={new Date()}
            progress={number('progress (prop)', undefined)}
          >
            {boolean('Custom children', false) && renderCustomChildren()}
          </DefaultPreview>
        </Lyra>
      )
    }

    if (propType === 'elements') {
      return (
        <Lyra
          part="part:@lyra/components/previews/default"
          propTables={[DefaultPreview]}
        >
          <DefaultPreview
            title={
              <span>
                This <span style={{color: 'green'}}>is</span> a{' '}
                <strong>test</strong>
              </span>
            }
            subtitle={
              <span>
                This is a <strong style={{color: 'red'}}>subtitle</strong>
              </span>
            }
            description={
              <span>
                This is the long the descriptions that should no be to long,
                beacuse we will cap it
              </span>
            }
            isPlaceholder={boolean('placeholder (prop)', false)}
            media={boolean('Show image', true) ? renderMedia : undefined}
            status={
              <div>
                <LinkIcon />
                <WarningIcon />
              </div>
            }
            date={new Date()}
            progress={number('progress (prop)')}
          >
            {boolean('Custom children', false) && renderCustomChildren()}
          </DefaultPreview>
        </Lyra>
      )
    }

    return (
      <Lyra
        part="part:@lyra/components/previews/default"
        propTables={[DefaultPreview]}
      >
        <DefaultPreview
          title={text(
            'title (prop)',
            'This is the title an it is very long, so long that it should be ellipsed'
          )}
          subtitle={text(
            'subtitle',
            `This is the title an it is very long, so long that it should be ellipsed.
               This is the title an it is very long, so long that it should be ellipsed`
          )}
          description={text(
            'description (prop)',
            'This is the long the descriptions that should no be to long, beacuse we will cap it'
          )}
          status={text('status', 'status')}
          media={boolean('Show image', true) ? renderMedia : undefined}
          isPlaceholder={boolean('placeholder (prop)', false)}
          date={new Date()}
          progress={number('progress (prop)', undefined)}
        >
          {boolean('Custom children', false) && renderCustomChildren()}
        </DefaultPreview>
      </Lyra>
    )
  })

  .add('Card', () => {
    const propType = select('Type of props', options, 'strings')

    if (propType === 'functions') {
      return (
        <Lyra
          part="part:@lyra/components/previews/card"
          propTables={[CardPreview]}
        >
          <CardPreview
            title={renderTitle}
            subtitle={renderSubtitle}
            description={renderDescription}
            date={boolean('date', true) ? new Date() : false}
            status={renderStatus}
            media={renderMedia}
            isPlaceholder={boolean('placeholder (prop)', true)}
            mediaAspect={number('mediaAspect (prop)', 4 / 3)}
          >
            {boolean('Custom children', false) && renderCustomChildren()}
          </CardPreview>
        </Lyra>
      )
    }

    if (propType === 'elements') {
      return (
        <Lyra
          part="part:@lyra/components/previews/card"
          propTables={[CardPreview]}
        >
          <CardPreview
            title={
              <span>
                This <span style={{color: 'green'}}>is</span> a{' '}
                <strong>test</strong>
              </span>
            }
            subtitle={
              <span>
                This is a <strong style={{color: 'red'}}>subtitle</strong>
              </span>
            }
            description={
              <span>
                This is the long the descriptions that should no be to long,
                beacuse we will cap it
              </span>
            }
            isPlaceholder={boolean('placeholder (prop)', false)}
            media={boolean('Show image', false) ? renderMedia : undefined}
            status={
              <div>
                <LinkIcon />
                <WarningIcon />
              </div>
            }
            date={boolean('date', true) ? new Date() : false}
            mediaAspect={number('mediaAspect (prop)', 4 / 3)}
          >
            {boolean('Custom children', false) && renderCustomChildren()}
          </CardPreview>
        </Lyra>
      )
    }

    return (
      <Lyra
        part="part:@lyra/components/previews/card"
        propTables={[CardPreview]}
      >
        <CardPreview
          title={text('title (prop)', 'This is the title')}
          subtitle={text('subtitle (prop)', 'This is the subtitle')}
          description={text(
            'description (prop)',
            'This is the long the descriptions that should no be to long, beacuse we will cap it'
          )}
          date={boolean('date', true) ? new Date() : false}
          status={text('status', 'status')}
          media={boolean('Show image', true) ? renderMedia : undefined}
          isPlaceholder={boolean('placeholder (prop)', true)}
          mediaAspect={number('mediaAspect (prop)', 4 / 3)}
        >
          {boolean('Custom children', false) && renderCustomChildren()}
        </CardPreview>
      </Lyra>
    )
  })

  .add('Detail', () => {
    const propType = select('Type of props', options, 'strings')

    if (propType === 'functions') {
      return (
        <Lyra
          part="part:@lyra/components/previews/detail"
          propTables={[DetailPreview]}
        >
          <DetailPreview
            title={renderTitle}
            subtitle={renderSubtitle}
            description={renderDescription}
            status={renderStatus}
            date={new Date()}
            media={renderMedia}
            isPlaceholder={boolean('isplaceholder (prop)', false)}
          >
            {boolean('Custom children', false) && renderCustomChildren()}
          </DetailPreview>
        </Lyra>
      )
    }

    if (propType === 'elements') {
      return (
        <Lyra
          part="part:@lyra/components/previews/detail"
          propTables={[DetailPreview]}
        >
          <DetailPreview
            title={
              <span>
                This <span style={{color: 'green'}}>is</span> a{' '}
                <strong>test</strong>
              </span>
            }
            subtitle={
              <span>
                This is a <strong style={{color: 'red'}}>subtitle</strong>
              </span>
            }
            description={
              <span>
                This is the long the descriptions that should no be to long,
                beacuse we will cap it
              </span>
            }
            status={
              <div>
                <LinkIcon />
                <WarningIcon />
              </div>
            }
            isPlaceholder={boolean('placeholder (prop)', false)}
            media={boolean('Show image', false) ? renderMedia : undefined}
            date={boolean('date', true) ? new Date() : false}
          >
            {boolean('Custom children', false) && renderCustomChildren()}
          </DetailPreview>
        </Lyra>
      )
    }

    return (
      <Lyra
        part="part:@lyra/components/previews/detail"
        propTables={[DetailPreview]}
      >
        <DetailPreview
          title={text('title (prop)', 'This is the title')}
          subtitle={text('subtitle (prop)', 'This is the subtitle')}
          description={
            <span>
              This is the long the{' '}
              <strong style={{color: 'magenta'}}>description</strong>
              &nbsp; that should no be to long, beacuse we will cap it. But this
              is an element, and that is why it is har to cap. This is the long
              the <strong style={{color: 'magenta'}}>description</strong>
              &nbsp; that should no be to long, beacuse we will cap it. But this
              is an element, and that is why it is har to cap.
            </span>
          }
          status={text('status', 'status')}
          date={new Date()}
          media={renderMedia}
          isPlaceholder={boolean('isplaceholder (prop)', false)}
        >
          {boolean('Custom children', false) && renderCustomChildren()}
        </DetailPreview>
      </Lyra>
    )
  })

  .add('Media', () => {
    return (
      <Lyra
        part="part:@lyra/components/previews/media"
        propTables={[MediaPreview]}
      >
        <MediaPreview
          title={text('title (prop)', 'This is the title')}
          subtitle={text('subtitle (prop)', 'This is the subtitle')}
          description={text(
            'description (prop)',
            'This is the long the descriptions that should no be to long, beacuse we will cap it'
          )}
          date={boolean('date', true) ? new Date() : false}
          media={renderMedia}
          isPlaceholder={boolean('isplaceholder (prop)', false)}
        >
          {boolean('Custom children', false) && renderCustomChildren()}
        </MediaPreview>
      </Lyra>
    )
  })

  .add('Inline', () => {
    const propType = select('Type of props', options, 'strings')
    if (propType === 'functions') {
      return (
        <Lyra
          part="part:@lyra/components/previews/inline"
          propTables={[InlinePreview]}
        >
          <p>
            This is a text, and suddenly a inline preview appearst before
            <InlinePreview
              title={renderTitle}
              media={renderMedia}
              isPlaceholder={boolean('isPlaceholder (prop)', false)}
            >
              {boolean('Custom children', false) && (
                <span>This is custom children</span>
              )}
            </InlinePreview>
            this word.
          </p>
        </Lyra>
      )
    }
    if (propType === 'elements') {
      return (
        <Lyra
          part="part:@lyra/components/previews/inline"
          propTables={[InlinePreview]}
        >
          <p>
            This is a text, and suddenly a inline preview appearst before
            <InlinePreview
              title={<span>title</span>}
              media={renderMedia}
              isPlaceholder={boolean('isPlaceholder (prop)', false)}
            >
              {boolean('Custom children', false) && (
                <span>This is custom children</span>
              )}
            </InlinePreview>
            this word.
          </p>
        </Lyra>
      )
    }
    return (
      <Lyra
        part="part:@lyra/components/previews/inline"
        propTables={[InlinePreview]}
      >
        <p>
          This is a text, and suddenly a inline preview appearst before
          <InlinePreview
            title={text('title (prop)', 'This is the title')}
            media={renderMedia}
            date={boolean('date', true) ? new Date() : false}
            isPlaceholder={boolean('isPlaceholder (prop)', false)}
          >
            {boolean('Custom children', false) && (
              <span>This is custom children</span>
            )}
          </InlinePreview>
          this word.
        </p>
      </Lyra>
    )
  })

  .add('Block', () => {
    const propType = select('Type of props', options, 'strings')

    if (propType === 'functions') {
      return (
        <Lyra
          part="part:@lyra/components/previews/detail"
          propTables={[DetailPreview]}
        >
          <BlockPreview
            title={renderTitle}
            subtitle={renderSubtitle}
            description={renderDescription}
            status={renderStatus}
            date={new Date()}
            media={renderMedia}
            isPlaceholder={boolean('isplaceholder (prop)', false)}
          >
            {boolean('Custom children', false) && renderCustomChildren()}
          </BlockPreview>
        </Lyra>
      )
    }

    if (propType === 'elements') {
      return (
        <Lyra
          part="part:@lyra/components/previews/detail"
          propTables={[DetailPreview]}
        >
          <BlockPreview
            title={
              <span>
                This <span style={{color: 'green'}}>is</span> a{' '}
                <strong>test</strong>
              </span>
            }
            subtitle={
              <span>
                This is a <strong style={{color: 'red'}}>subtitle</strong>
              </span>
            }
            description={
              <span>
                This is the long the descriptions that should no be to long,
                beacuse we will cap it
              </span>
            }
            status={
              <div>
                <LinkIcon />
                <WarningIcon />
              </div>
            }
            isPlaceholder={boolean('placeholder (prop)', false)}
            media={boolean('Show image', false) ? renderMedia : undefined}
            date={boolean('date', true) ? new Date() : false}
          >
            {boolean('Custom children', false) && renderCustomChildren()}
          </BlockPreview>
        </Lyra>
      )
    }

    return (
      <Lyra
        part="part:@lyra/components/previews/detail"
        propTables={[DetailPreview]}
      >
        <BlockPreview
          title={text('title (prop)', 'This is the title')}
          subtitle={text('subtitle (prop)', 'This is the subtitle')}
          description={text('description (prop)', 'This is the description')}
          status={text('status', 'status')}
          date={new Date()}
          media={renderMedia}
          isPlaceholder={boolean('isplaceholder (prop)', false)}
        >
          {boolean('Custom children', false) && renderCustomChildren()}
        </BlockPreview>
      </Lyra>
    )
  })
  .add('Block image', () => {
    const propType = select('Type of props', options, 'strings')

    if (propType === 'functions') {
      return (
        <Lyra
          part="part:@lyra/components/previews/detail"
          propTables={[DetailPreview]}
        >
          <BlockImagePreview
            title={renderTitle}
            subtitle={renderSubtitle}
            description={
              boolean('description (prop)', false) ? renderDescription : ''
            }
            status={renderStatus}
            date={new Date()}
            media={renderMedia}
            isPlaceholder={boolean('isplaceholder (prop)', false)}
          >
            {boolean('Custom children', false) && renderCustomChildren()}
          </BlockImagePreview>
        </Lyra>
      )
    }

    if (propType === 'elements') {
      return (
        <Lyra
          part="part:@lyra/components/previews/detail"
          propTables={[DetailPreview]}
        >
          <BlockImagePreview
            title={
              <span>
                This <span style={{color: 'green'}}>is</span> a{' '}
                <strong>test</strong>
              </span>
            }
            subtitle={
              <span>
                This is a <strong style={{color: 'red'}}>subtitle</strong>
              </span>
            }
            description={
              <span>
                This is the long the{' '}
                <strong style={{color: 'magenta'}}>description</strong>
                &nbsp; that should no be to long, beacuse we will cap it. But
                this is an element, and that is why it is har to cap. This is
                the long the{' '}
                <strong style={{color: 'magenta'}}>description</strong>
                &nbsp; that should no be to long, beacuse we will cap it. But
                this is an element, and that is why it is har to cap.
              </span>
            }
            status={
              <div>
                <LinkIcon />
                <WarningIcon />
              </div>
            }
            isPlaceholder={boolean('placeholder (prop)', false)}
            media={boolean('Show image', false) ? renderMedia : undefined}
            date={boolean('date', true) ? new Date() : false}
          >
            {boolean('Custom children', false) && renderCustomChildren()}
          </BlockImagePreview>
        </Lyra>
      )
    }

    return (
      <Lyra
        part="part:@lyra/components/previews/detail"
        propTables={[DetailPreview]}
      >
        <BlockImagePreview
          title={text('title (prop)', 'This is the title')}
          subtitle={text('subtitle (prop)', 'This is the subtitle')}
          description={text('description (prop)', 'This is the description')}
          status={text('status', 'status')}
          date={new Date()}
          media={renderMedia}
          isPlaceholder={boolean('isplaceholder (prop)', false)}
        >
          {boolean('Custom children', false) && renderCustomChildren()}
        </BlockImagePreview>
      </Lyra>
    )
  })
