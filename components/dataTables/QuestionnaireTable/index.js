import React from 'react'
import { FieldArray } from "formik";
import Table from './Table';
import { Persist } from 'formik-persist'

export default function QuestionnaireTable() {
  return (
    <>
      <FieldArray name="questions">
        {arrayHelpers => (
          <Table
            name="questions"
            handleAdd={arrayHelpers.push}
            handleRemove={arrayHelpers.remove}
          />
        )}
      </FieldArray>
      <Persist name='questionnaire' />
    </>
  )
}
