import BooleanInput from '../../inputs/BooleanInput'
import EmailInput from '../../inputs/EmailInput'
import NumberInput from '../../inputs/NumberInput'
import ObjectInput from '../../inputs/ObjectInput'
import StringInput from '../../inputs/StringInput'
import {DateTimeInput, DateInput} from '../../inputs/DateInputs'
import TextInput from '../../inputs/TextInput'
import UrlInput from '../../inputs/UrlInput'
import SlugInput from '../../inputs/Slug/SlugInput'

import LyraArrayInput from '../inputs/LyraArrayInput'
import Image from '../inputs/LyraImageInput'
import File from '../inputs/LyraFileInput'

export default {
  object: ObjectInput,
  array: LyraArrayInput,
  boolean: BooleanInput,
  number: NumberInput,
  text: TextInput,
  email: EmailInput,
  datetime: DateTimeInput,
  date: DateInput,
  url: UrlInput,
  image: Image,
  file: File,
  string: StringInput,
  slug: SlugInput
}
