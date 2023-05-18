import { useFormikContext } from "formik";
import React from "react";
import Priority from "@ui-library/Priority";
import styled from "styled-components";

export default function PriorityBadge() {
  const formik = useFormikContext();
  return (
    <StyledPriority>
      <Priority
        type="Q"
        importance={formik.values.importance}
        frequency={formik.values.frequency}
        showShowFullLabel={true}
        linebreak={true}
      />
    </StyledPriority>
  );
}

const StyledPriority = styled.div`
  width: 100px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
`;
