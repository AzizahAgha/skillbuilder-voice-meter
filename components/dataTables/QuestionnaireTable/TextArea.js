import React from 'react'
import { useField } from "formik";
import TextareaWithCounter from '@ui-library/TextareaWithCounter'

const TextArea = ({ row }) => {
  const { index } = row;
  const name = `questions[${index}].question`
  const [ field ] = useField({ name, type: "text" });

  return (
    <div className="m-1">
      <TextareaWithCounter 
        id={name}  
        name={name}
        maxLength={1000}
        placeholder='Enter your question... '
        {...field}
      />
    </div>
  )
}

export default React.memo(TextArea);
