import React from "react";
import { useFormikContext } from "formik";
import Priority from "@ui-library/Priority";

export default function RiskBadge({ row }) {
  const { index } = row;
  const formik = useFormikContext();

  return (
    <Priority
      type="A"
      confidence={formik.values.questions[index]?.confidence}
      differentiation={formik.values.questions[index]?.differentiation}
      showShowFullLabel={true}
    />
  );
}
