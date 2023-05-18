import React, { useEffect } from 'react';
import {  useFormikContext } from 'formik';

export default function FormObserver ({ onChange }) {
  const { values } = useFormikContext();

  useEffect(() => {
    if(typeof onChange === 'function') {
      onChange(values);
    }
  }, [values]);  
  
  return null;
}