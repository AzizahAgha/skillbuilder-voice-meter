import React from "react";
import { useFormikContext } from "formik";
import Priority from "@ui-library/Priority";
import styled from "styled-components";

export default function Question({ value, row: { index } }) {
  const { values } = useFormikContext();
  return (
    <Wrapper>
      <Priority
        type="Q"
        importance={values.questions[index]?.importance}
        frequency={values.questions[index]?.frequency}
        showShowFullLabel={true}
      />
      <Text>{value}</Text>
    </Wrapper>
  );
}

const Text = styled.div`
  white-space: pre-wrap;
`;

const Wrapper = styled.div`
  max-width: 364px;
  padding: 0.8rem;

  font-family: "Manrope";
  font-style: normal;
  font-weight: 400;
  font-size: 14.5px;
  word-wrap: break-word;

  & > div:first-child {
    justify-content: flex-start;
  }

  @media only screen and (min-width: 1300px) {
    min-width: 100%;
  }
`;
