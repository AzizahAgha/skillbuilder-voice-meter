import React from "react";
import { useFormikContext } from "formik";
import Priority from "@ui-library/Priority";
import styled from "styled-components";

export default function RiskBadge({fromAnswerEditor}) {
  const formik = useFormikContext();
  return (
    <StyledRisk>
      <Priority
        type="A"
        confidence={formik.values.confidence}
        differentiation={formik.values.differentiation}
        showShowFullLabel={true}
        linebreak={true}
        fromAnswerEditor={fromAnswerEditor}
      />
    </StyledRisk>
  );
}

const StyledRisk = styled.div`
  width: 100px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
`;
