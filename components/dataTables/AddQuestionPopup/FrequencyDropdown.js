import React from 'react'
import { useFormikContext } from 'formik'
import Dropdown from '@ui-library/Dropdown'

export default function FrequencyDropdown() {
  const formik = useFormikContext();
  
  return (
    <div>
      <Dropdown 
        placeholder='Select One'
        name='frequency'
        value={formik.values.frequency}
        onSelect={({ frequency }) => formik.setFieldValue('frequency', frequency)}
        options={[
          { frequency: 'Always', background: '#1F5462', color: '#FFF' }, 
          { frequency: 'Sometimes', background: '#81C2C0', color: '#FFF' }, 
          { frequency: 'Rarely', background: '#E0F4F4', color: '#1F5462' }
        ]}
      />
    </div>
  )
}
