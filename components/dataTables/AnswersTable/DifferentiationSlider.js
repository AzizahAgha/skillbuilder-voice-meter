import React from 'react'
import { useFormikContext } from 'formik'
import SliderDropdown from '@ui-library/SliderDropdown';
import { getDifferentiationLabel } from '@utils/helpers';

function DifferentiationSlider({ row }) {
  const { index } = row;
  const formik = useFormikContext();
  const value = formik.values.questions[index]?.differentiation;
  
  return (
    <SliderDropdown
      value={value}
      label={getDifferentiationLabel(value)}
      setValue={(differentiation) => 
        formik.setFieldValue(`questions[${index}].differentiation`, differentiation)
      }
      type='Differentiation'
    />
  )
}

export default DifferentiationSlider
