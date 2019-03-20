import {blocksToEditorValue} from '@lyra/block-tools'
import {Value} from 'slate'

export default function deserialize(value, type) {
  return Value.fromJSON(blocksToEditorValue(value, type))
}
