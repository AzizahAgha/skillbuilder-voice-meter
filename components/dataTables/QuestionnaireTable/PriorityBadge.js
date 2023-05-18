import { useFormikContext } from "formik";
import React from "react";
import Priority from "@ui-library/Priority";

export default function PriorityBadge({ row }) {
  const { index } = row;
  const formik = useFormikContext();

  return (
    <Priority
      type="Q"
      importance={formik.values.questions[index]?.importance}
      frequency={formik.values.questions[index]?.frequency}
      showShowFullLabel={true}
    />
  );
}
