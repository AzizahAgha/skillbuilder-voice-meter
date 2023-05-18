import { getDifferentiationLabel } from '@utils/helpers';
import React from 'react'
import SliderDropdown from '@ui-library/SliderDropdown';

function DifferentiationSlider({ value }) {
  return (
    <SliderDropdown
      value={value}
      label={getDifferentiationLabel(value)}
      type='Differentiation'
      readOnly
    />
  )
}

export default DifferentiationSlider
