/**
 * Created with https://www.npmjs.com/package/react-tag-input
 * Mainly used in InvitePopup for email input
 */
import React, { useEffect } from "react";
import { useFormikContext } from "formik";
import { WithContext as ReactTags } from "react-tag-input";
import styled from "styled-components";

const KeyCodes = {
  COMMA: 188,
  ENTER: 13,
  SPACE: 32,
};

const delimiters = [KeyCodes.COMMA, KeyCodes.ENTER, KeyCodes.SPACE];

export default function TagsInput({
  name, // required.
  disabled,
  ...props
}) {
  const formik = useFormikContext();

  const handleAddition = (tag) => {
    formik.setFieldValue(name, [...formik.values[name], tag]);
  };

  const handleDelete = (i) => {
    formik.setFieldValue(
      name,
      formik.values[name].filter((tag, index) => index !== i)
    );
  };

  useEffect(() => {
    const textField = document
      .getElementById("invite-wrapper")
      .getElementsByTagName("input");

    if (disabled === true) {
      textField[0].blur();
    }
  }, [disabled]);

  return (
    <Wrapper disabled={disabled} id="invite-wrapper">
      <ReactTags
        tags={formik.values[name]}
        delimiters={delimiters}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        inputFieldPosition="inline"
        allowDragDrop={false}
        inline
        {...props}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  flex: 1;

  .ReactTags__selected {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .tag-wrapper {
    background-color: #003647;
    border-radius: 50rem;
    color: white;
    padding: 0.25rem 0.75rem;

    font-family: Manrope;
    font-style: normal;
    font-weight: normal;

    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0.1rem 0;
    margin-right: 0.2rem;

    button {
      border-radius: 50%;
      height: 15px;
      width: 15px;
      color: black;
      font-size: 18px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin-left: 0.2rem;
    }
  }

  .ReactTags__tagInput {
    display: flex;
    flex: 1;

    input {
      width: 100%;
      min-width: 200px;
      pointer-events: ${(props) => (props.disabled === true ? "none" : "")};
      background: transparent;
      border: none;
      font-family: Manrope;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 19px;
      letter-spacing: 0.02em;
      color: #393d3e;
    }
  }
`;
