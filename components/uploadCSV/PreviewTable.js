import React, { useState } from "react";
import Question from "@ui-library/Question";
import Answer from "@ui-library/Answer";
import Table from "@ui-library/Table";
import styled from "styled-components";

function PreviewTable({ data }) {
  const headers = [
    {
      name: "#",
      width: "51px",
      stretched: true,
      renderer: (item, row) => (
        <div className="w-100 text-center pt-2">
          {`${parseInt(row) + 1}`.padStart(2, "0")}
        </div>
      ),
    },
    {
      name: "Your Questions",
      stretched: true,
      renderer: ({ questionText, importance, frequency }) => (
        <Question
          frequency={frequency}
          importance={importance}
          question={questionText}
        />
      ),
    },
    {
      name: "Your Answers",
      stretched: true,
      renderer: ({ answers, differentiation, confidence }) => (
        <>
          {answers?.length !== 0 && (
            <Answer answer={answers} previewAnswer={true} />
          )}
        </>
      ),
    },
  ];

  return <Table headers={headers} showHeader={true} data={data} />;
}

export default PreviewTable;
