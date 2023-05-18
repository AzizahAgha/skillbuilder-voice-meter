import React from "react";
import { useFormikContext } from "formik";
import SliderDropdown from "@ui-library/SliderDropdown";
import { getConfidenceLabel } from "@utils/helpers";
function ConfidenceSlider({ row }) {
  const { index } = row;
  const formik = useFormikContext();
  const value = formik.values.questions[index]?.confidence;

  return (
    <SliderDropdown
      value={value}
      label={getConfidenceLabel(value)}
      setValue={(confidence) =>
        formik.setFieldValue(`questions[${index}].confidence`, confidence)
      }
      type="Confidence"
    />
  );
}

export default ConfidenceSlider;
