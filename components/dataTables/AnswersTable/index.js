import React, { useState } from "react";
import { FieldArray } from "formik";
import { Persist } from "formik-persist";
import Table from "./Table";

export default function AnswersTable({ auth }) {
  return (
    <>
      <FieldArray name="questions">
        {(arrayHelpers) => (
          <Table
            name="questions"
            handleAdd={arrayHelpers.push}
            handleRemove={arrayHelpers.remove}
          />
        )}
      </FieldArray>
      <Persist name="questions" />
    </>
  );
}
