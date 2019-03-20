import React from 'react'
import PropTypes from 'prop-types'
import {get} from 'lodash'
import {FormBuilderInput} from 'part:@lyra/form-builder'
import styles from './styles/ArticleFormBuilderInput.css'
import RequireRole from '@vega/components/RequireRole'

const defaultFieldAccess = ['editor', 'submitter', 'admin']

export default class ArticleFormBuilderInput extends React.PureComponent {
  static propTypes = {
    value: PropTypes.object,
    type: PropTypes.object,
    markers: PropTypes.array,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    focusPath: PropTypes.array
  }

  render() {
    const {
      type,
      value,
      markers,
      onChange,
      onFocus,
      onBlur,
      focusPath
    } = this.props

    return (
      <div>
        {type.fields.map(field => {
          const roles =
            get(field.type, 'options.access.edit') || defaultFieldAccess

          const handleFieldChange = patchEvent =>
            onChange(patchEvent.prefixAll(field.name))

          return (
            <RequireRole
              key={field.name}
              qualifyingRoleNames={roles}
              subject={value}
            >
              {({hasRole}) => {
                return (
                  hasRole && (
                    <div className={styles.input}>
                      <FormBuilderInput
                        markers={markers}
                        focusPath={focusPath}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        path={[field.name]}
                        type={field.type}
                        value={value[field.name]}
                        onChange={handleFieldChange}
                      />
                    </div>
                  )
                )
              }}
            </RequireRole>
          )
        })}
      </div>
    )
  }
}
