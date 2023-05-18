import { getImportanceLabel } from "@utils/helpers";
import { useFormikContext } from "formik";
import React from "react";
import SliderDropdown from "@ui-library/SliderDropdown";

function ImportanceSlider({ row }) {
  const { index } = row;
  const formik = useFormikContext();
  const value = formik.values.questions[index]?.importance;

  return (
    <SliderDropdown
      type="Importance"
      value={value}
      label={getImportanceLabel(value)}
      setValue={(importance) =>
        formik.setFieldValue(`questions[${index}].importance`, importance)
      }
    />
  );
}

export default ImportanceSlider;
