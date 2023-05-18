import React from "react";
import { useFormikContext } from "formik";

import dynamic from "next/dynamic";
import styled from "styled-components";
import { values } from "lodash";
const TextEditor = dynamic(() => import("@ui-library/TextEditor"), {
  ssr: false,
});

export default function AnswerEditor({ row }) {
  const { index } = row;
  const formik = useFormikContext();

  return (
    <EditorWrapper>
      <TextEditor
        value={
          formik.values.questions[index]?.answer
            ? formik.values.questions[index]?.answer
            : JSON.parse(localStorage.getItem("answers"))[index]
        }
        onChange={(value) => {
          formik.setFieldValue(`questions[${index}].answer`, value);
          let answersArray = JSON.parse(localStorage.getItem("answers"));
          answersArray[index] = value;
          localStorage.setItem("answers", JSON.stringify(answersArray));
        }}
        isResizable
      />
    </EditorWrapper>
  );
}
const EditorWrapper = styled.div`
  // padding: 0.8rem;
  // font-family: "Manrope";
  // font-style: normal;
  // font-weight: 400;
  // font-size: 14.5px;
  // word-wrap: break-word;

  height: 100%;
  min-width: 300px;
  max-width: 350px;

  @media only screen and (min-width: 1300px) {
    min-width: 100%;
  }
  @media (max-width: 1224px) {
    max-width: 100%;
  }
`;
