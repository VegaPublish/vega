// @flow
import {arrayToJSONMatchPath} from '@lyra/mutator'
import type {Path, PathSegment} from '../../typedefs/path'

const IS_NUMERIC = /^\d+$/

function unquote(str) {
  return str.replace(/^['"]/, '').replace(/['"]$/, '')
}

function splitAttr(segment) {
  const [attr, key] = segment.split('==')
  return {[attr]: unquote(key)}
}

function coerce(segment: string): PathSegment {
  return IS_NUMERIC.test(segment) ? Number(segment) : segment
}

function parseSagaPath(focusPathStr): Path {
  return focusPathStr
    .split(/[[.\]]/g)
    .filter(Boolean)
    .map(seg => (seg.includes('==') ? splitAttr(seg) : coerce(seg)))
}

export function toSaga(formBuilderPath: Path): string {
  return arrayToJSONMatchPath(formBuilderPath)
}

export function toFormBuilder(sagaPath: string) {
  return parseSagaPath(sagaPath)
}
