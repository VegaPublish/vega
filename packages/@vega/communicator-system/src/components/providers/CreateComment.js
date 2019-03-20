//@flow
import React from 'react'
import {of as observableOf, defer, merge, concat, combineLatest} from 'rxjs'
import schema from 'part:@lyra/base/schema'
import {
  map,
  filter,
  mapTo,
  share,
  switchMap,
  startWith,
  withLatestFrom,
  concatMap,
  tap
} from 'rxjs/operators'
import {FormBuilder, PatchEvent} from 'part:@lyra/form-builder'
import Button from 'part:@lyra/components/buttons/default'
import {withPropsStream, createEventHandler} from 'react-props-stream'
import {currentUser$} from 'part:@vega/datastores/user'
import CommentBodyInput from '../views/CommentBodyInput'
import {createComment, withPatchesFrom} from '../../datastores/commentStore'
import {PreviewFields} from 'part:@lyra/base/preview'
import {observePaths} from 'part:@lyra/base/preview'
import styles from './styles/CreateComment.css'

type Props = {
  draft: {
    _id: string,
    body: Array<*>,
    threadId: string,
    subject: {type: 'reference', _ref: string}
  },
  className: 'string',
  onChange: PatchEvent => void,
  onSubmit: () => void,
  submitState: {
    status: 'submitting' | 'submitted'
  }
}

const hasContent = comment => comment.body && comment.body.length > 0

const randomString = () =>
  Math.random()
    .toString(32)
    .substring(2)

const createEmptyComment = () => ({
  _id: `proforma-draft-${randomString()}`,
  _type: 'comment'
})

function connect(props$) {
  const [onSubmit$, onSubmit] = createEventHandler()
  const [onChange$, onChange] = createEventHandler()
  const patchChannel = FormBuilder.createPatchChannel()

  // Whenever a submit is successful, emit an reset event, that maps to the current props
  // eslint-disable-next-line no-use-before-define
  const reset$ = defer(() => submits$).pipe(
    filter(ev => ev.status === 'submitted'),
    withLatestFrom(props$),
    map(([_, props]) => props)
  )

  // newDrafts is a stream of empty drafts created based on values provided in incoming props
  const newDrafts$ = combineLatest(merge(props$, reset$), currentUser$).pipe(
    map(([props, currentUser]) => ({
      ...createEmptyComment(),
      subject: props.subjectId && {_type: 'reference', _ref: props.subjectId},
      threadId: props.threadId,
      author: {_type: 'reference', _ref: currentUser._id}
    }))
  )

  const comment$ = newDrafts$.pipe(
    withPatchesFrom(
      onChange$.pipe(
        map(patchEvent =>
          patchEvent.patches.map(patch => ({...patch, origin: 'local'}))
        )
      )
    ),
    tap(e => patchChannel.receivePatches(e)),
    map(({snapshot}) => snapshot)
  )

  const submits$ = comment$.pipe(
    switchMap(comment =>
      // for every comment that passes through, we wait for the next onSubmit to be called
      // and map it to the comment
      onSubmit$.pipe(mapTo(comment))
    ),
    concatMap(comment =>
      concat(
        observableOf({status: 'submitting', comment}),
        createComment(comment).pipe(
          map(result => ({
            status: 'submitted',
            result
          }))
        )
      )
    ),
    share()
  )
  return combineLatest(props$, comment$, submits$.pipe(startWith({}))).pipe(
    map(([srcProps, comment, submitState]) => ({
      ...srcProps,
      draft: comment,
      submitState,
      onSubmit,
      onChange,
      patchChannel
    }))
  )
}

const ShowCommentSubject = withPropsStream(
  props$ =>
    props$.pipe(
      switchMap(props =>
        observePaths({_id: props.subjectId}, ['_type']).pipe(
          map(doc => ({
            ...props,
            document: doc
          }))
        )
      )
    ),
  props => (
    <PreviewFields
      document={props.document}
      type={schema.get(props.document._type)}
      fields={['title']}
    >
      {props.children}
    </PreviewFields>
  )
)

export default withPropsStream(connect, (props: Props) => {
  const {
    draft,
    onChange,
    onClose,
    onSubmit,
    patchChannel,
    submitState = {},
    className,
    showCloseButton,
    onClick
  } = props
  const canSubmit = hasContent(draft) && submitState.status !== 'submitting'

  return (
    <div className={className} onClick={onClick}>
      <div className={styles.header}>
        {showCloseButton && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        )}
        {draft.subject && (
          <ShowCommentSubject subjectId={draft.subject._ref}>
            {val => {
              return (
                <div>
                  <strong>{draft.threadId ? 'Reply:' : 'Comment on'}</strong>
                  &nbsp;
                  <span className={styles.valueTitle}>{val.title}</span>
                </div>
              )
            }}
          </ShowCommentSubject>
        )}
      </div>
      <CommentBodyInput
        key={draft._id}
        patchChannel={patchChannel}
        comment={draft}
        onChange={onChange}
      />
      <div className={styles.footer}>
        <Button
          color="primary"
          type="button"
          onClick={event => {
            onSubmit(event)
            onClose(event)
          }}
          disabled={!canSubmit}
        >
          Submit
        </Button>
        {onClose && (
          <Button color="danger" type="button" kind="simple" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  )
})
