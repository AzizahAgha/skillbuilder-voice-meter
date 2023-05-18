import React from 'react';
import { useFormikContext } from 'formik';
import SliderDropdown from '@ui-library/SliderDropdown';
import { getDifferentiationLabel } from '@utils/helpers';

export default function DifferentiationSlider({fromAnswerEditor}) {
  const formik = useFormikContext();
  const value = formik.values.differentiation;

  return (
      <SliderDropdown
        value={value}
        label={getDifferentiationLabel(value)}
        setValue={(differentiation) => formik.setFieldValue('differentiation', differentiation)}
        type='Differentiation'
        fromAnswerEditor={fromAnswerEditor}
      />
  )
}
