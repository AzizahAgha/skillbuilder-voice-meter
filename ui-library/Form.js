import React from "react";
import styled from "styled-components";
import { Form } from "react-bootstrap";
import { useField, useFormikContext } from "formik";
import PhoneNumberInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

export const Label = ({ children, isError = false }) =>
  children ? (
    <FormLabel>
      {children}
      {isError && <span className="text-danger">*</span>}
    </FormLabel>
  ) : (
    ""
  );

export function InputField({ name, label, ...props }) {
  const [field] = useField({ name, type: "text" });
  const formik = useFormikContext();
  const isError = formik.touched[name] && formik.errors[name];

  return (
    <Form.Group controlId={name}>
      <Label isError={isError}>{label}</Label>

      <Form.Control
        className={`
          border
          ${isError ? "border-danger" : "border-primary"}
        `}
        {...props}
        {...field}
      />
    </Form.Group>
  );
}

export const FormLabel = styled(Form.Label)`
  &&& {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.02em;
    color: #003647;
  }
`;

export function PhoneInput({ name, label, ...props }) {
  const formik = useFormikContext();
  const isError = formik.touched[name] && formik.errors[name];
  return (
    <Form.Group controlId={name}>
      <Label isError={isError}>{label}</Label>

      <StyledPhoneInput
        className={`border 
          ${isError ? "border-danger" : "border-primary"} 
          form-control d-flex
        `}
        international
        countryCallingCodeEditable={false}
        defaultCountry="US"
        onChange={(value) => formik.setFieldValue(name, value)}
        onBlur={() => formik.setFieldTouched(name, true)}
        value={formik.values[name]}
        limitMaxLength={true}
        {...props}
        // maxLength="10"
      />
    </Form.Group>
  );
}

const StyledPhoneInput = styled(PhoneNumberInput)`
  .PhoneInputInput {
    border: none !important;

    &:focus,
    &:focus-visible {
      outline: none;
    }
  }
`;

export function CountrySelect({
  name = "country",
  label = "Country",
  ...props
}) {
  const formik = useFormikContext();
  const isError = formik.touched[name] && formik.errors[name];

  return (
    <Form.Group controlId={name}>
      <Label isError={isError}>{label}</Label>

      <CountryDropdown
        className={`border 
          ${isError ? "border-danger" : "border-primary"} 
          form-select
        `}
        value={formik?.values?.[name]}
        onChange={(value) => formik.setFieldValue(name, value)}
        onBlur={() => formik.setFieldTouched(name, true)}
        {...props}
      />
    </Form.Group>
  );
}

export function StateSelect({ name = "state", label = "State", ...props }) {
  const formik = useFormikContext();
  const isError = formik.touched[name] && formik.errors[name];

  return (
    <Form.Group controlId={name}>
      <Label isError={isError}>{label}</Label>

      <RegionDropdown
        className={`border 
          ${isError ? "border-danger" : "border-primary"} 
          form-select
        `}
        value={formik?.values?.[name]}
        onChange={(value) => formik.setFieldValue(name, value)}
        onBlur={() => formik.setFieldTouched(name, true)}
        {...props}
      />
    </Form.Group>
  );
}
