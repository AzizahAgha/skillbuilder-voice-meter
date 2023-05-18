import React from 'react';
import { useFormikContext } from 'formik';
import SliderDropdown from '@ui-library/SliderDropdown';
import { getConfidenceLabel } from '@utils/helpers';

export default function ConfidenceSlider({fromAnswerEditor}) {
  const formik = useFormikContext();
  const value = formik.values.confidence;

  return (
      <SliderDropdown
        value={value}
        label={getConfidenceLabel(value)}
        setValue={(confidence) => formik.setFieldValue('confidence', confidence)}
        type='Confidence'
        fromAnswerEditor={fromAnswerEditor}
      />
  )
}