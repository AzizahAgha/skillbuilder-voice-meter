import { getConfidenceLabel } from '@utils/helpers';import React from 'react'
import SliderDropdown from '@ui-library/SliderDropdown';

function ConfidenceSlider({ value }) {
  return (
    <SliderDropdown
      value={value}
      label={getConfidenceLabel(value)}
      readOnly
      type='Confidence'
    />
  )
}

export default ConfidenceSlider
