//@flow
import React from 'react'
import {of as observableOf, concat, combineLatest} from 'rxjs'
import {
  map,
  mapTo,
  share,
  tap,
  take,
  switchMap,
  startWith,
  withLatestFrom,
  concatMap
} from 'rxjs/operators'
import {FormBuilder, PatchEvent} from 'part:@lyra/form-builder'
import Button from 'part:@lyra/components/buttons/default'
import {withPropsStream, createEventHandler} from 'react-props-stream'
import CommentBodyInput from '../views/CommentBodyInput'
import {updateComment, withPatchesFrom} from '../../datastores/commentStore'
import styles from './styles/EditComment.css'

type Props = {
  comment: {
    _id: string,
    author: {
      _id: string
    },
    body: Array<*>,
    subject: {
      _ref: string
    },
    threadId?: string
  },
  onUpdate: Function,
  onSubmit: Function,
  onChange: PatchEvent => void,
  isSubmitting: boolean
}

const hasContent = comment => comment.body && comment.body.length > 0
function connect(props$) {
  const [onSubmit$, onSubmit] = createEventHandler()
  const [onChange$, onChange] = createEventHandler()
  const patchChannel = FormBuilder.createPatchChannel()

  // This is a stream of the current comment (with patches from onChange applied)
  const comment$ = props$.pipe(
    map(props => props.comment),
    take(1),
    withPatchesFrom(
      onChange$.pipe(
        map(patchEvent =>
          patchEvent.patches.map(patch => ({...patch, origin: 'local'}))
        )
      )
    ),
    tap(e => patchChannel.receivePatches(e)),
    map(({snapshot}) => snapshot),
    share()
  )

  const saves$ = comment$.pipe(
    switchMap(comment =>
      // every time a new comment version passes through, we wait for the next onSubmit to be called
      // and map it to the comment
      onSubmit$.pipe(mapTo(comment))
    ),
    concatMap(comment =>
      concat(
        observableOf({status: 'submitting', comment}),
        updateComment(comment).pipe(
          map(result => ({
            status: 'submitted',
            result
          })),
          withLatestFrom(props$),
          tap(([_, props]) => props.onEditEnd())
        )
      )
    ),
    share()
  )
  return combineLatest(props$, comment$, saves$.pipe(startWith({}))).pipe(
    map(([srcProps, comment, saveState]) => ({
      ...srcProps,
      comment,
      saveState: saveState,
      onSubmit,
      onChange,
      patchChannel
    }))
  )
}

export default withPropsStream(connect, (props: Props) => {
  const {comment, onChange, onSubmit, isSubmitting, patchChannel} = props
  const canSubmit = hasContent(comment) && !isSubmitting

  return (
    <div className={styles.root}>
      <CommentBodyInput
        comment={comment}
        onChange={onChange}
        patchChannel={patchChannel}
      />
      <Button type="button" onClick={onSubmit} disabled={!canSubmit}>
        Update
      </Button>
    </div>
  )
})
