import React from "react";

import QandADropdown from "./QandADropdown";

export default function SliderDropdown({
  value,
  setValue,
  label,
  type,
  fromAnswerEditor,
  readOnly = false,
}) {
  return (
    <QandADropdown
      value={value}
      setValue={setValue}
      label={label}
      type={type}
      fromAnswerEditor={fromAnswerEditor}
      readOnly={readOnly}
    />
  );
}
