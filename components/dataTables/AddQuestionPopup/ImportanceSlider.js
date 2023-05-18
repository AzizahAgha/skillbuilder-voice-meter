import React from "react";
import { useFormikContext } from "formik";
import SliderDropdown from "@ui-library/SliderDropdown";
import { getImportanceLabel } from "@utils/helpers";

function ImportanceSlider() {
  const formik = useFormikContext();
  const value = formik.values.importance;

  return (
    <SliderDropdown
      type="Importance"
      value={value}
      label={getImportanceLabel(value)}
      setValue={(importance) => formik.setFieldValue("importance", importance)}
    />
  );
}

export default ImportanceSlider;
