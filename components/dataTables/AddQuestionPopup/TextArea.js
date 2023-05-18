import React from 'react'
import { useField } from "formik";
import TextareaWithCounter from '@ui-library/TextareaWithCounter'

const TextArea = () => {
  const [ field ] = useField({ name: 'question', type: "text" });

  return (
    <TextareaWithCounter
      name='question'
      maxLength={1000}
      placeholder='Enter your question... '
      {...field}
    />
  )
}

export default React.memo(TextArea);
