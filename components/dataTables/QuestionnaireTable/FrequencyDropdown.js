import React from 'react'
import {useFormikContext} from 'formik'
import Dropdown, {Options} from '@ui-library/Dropdown'

export default function FrequencyDropdown({ row }) {
  const { index } = row;
  const formik = useFormikContext();

  return (
    <Dropdown
      placeholder='Select One'
      name='frequency'
      value={formik.values.questions[index]?.frequency}
      onSelect={({ frequency }) =>
        formik.setFieldValue( `questions[${index}].frequency`, frequency)
      }
      options={Options.Frequency}
    />
  )
}
