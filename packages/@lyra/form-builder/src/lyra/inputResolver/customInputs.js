// These are inputs that may be implemented by provided parts
import BooleanInput from 'part:@lyra/form-builder/input/boolean?'
import CodeInput from 'part:@lyra/form-builder/input/code?'
import DateTimeInput from 'part:@lyra/form-builder/input/datetime?'
import EmailInput from 'part:@lyra/form-builder/input/email?'
import GeoPointInput from 'part:@lyra/form-builder/input/geopoint?'
import NumberInput from 'part:@lyra/form-builder/input/number?'
import ObjectInput from 'part:@lyra/form-builder/input/object?'
import ReferenceInput from 'part:@lyra/form-builder/input/reference?'
import RichDateInput from 'part:@lyra/form-builder/input/rich-date?'
import StringInput from 'part:@lyra/form-builder/input/string?'
import TextInput from 'part:@lyra/form-builder/input/text?'
import UrlInput from 'part:@lyra/form-builder/input/url?'

export default {
  object: ObjectInput,
  boolean: BooleanInput,
  number: NumberInput,
  string: StringInput,
  text: TextInput,
  reference: ReferenceInput,
  datetime: DateTimeInput,
  richDate: RichDateInput,
  email: EmailInput,
  geopoint: GeoPointInput,
  code: CodeInput,
  url: UrlInput
}
