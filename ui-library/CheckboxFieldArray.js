import React from 'react';
import { FieldArray, useFormikContext } from 'formik';
import Checkbox from './Checkbox';

export default function CheckboxFieldArray({ name, fields }) {
  const { values } = useFormikContext();
  return (
    <FieldArray
      name={name}
      render={arrayHelpers => (
        <>
          {fields.map((field, idx) => (
            <span key={idx}>
              <Checkbox
                name={name}
                value={field}
                label={field.label}
                id={field.id || field.value}
                checked={values[name]?.includes(field.value)}
                onChange={e => {
                  if (e.target.checked) {
                    arrayHelpers.push(field.value);
                  } else {
                    const idx = values[name].indexOf(field.value);
                    arrayHelpers.remove(idx);
                  }
                }}
                {...field}
              />
            </span>
          ))}
        </>
      )}
    />
  )
}
