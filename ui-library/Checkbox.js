import React from "react";
import styled from "styled-components";
import { Form } from "react-bootstrap";

const Checkbox = (props) => <StyledCheckbox type="checkbox" {...props} />;

export default Checkbox;

const StyledCheckbox = styled(Form.Check)`
  &&& {
    //display: inline-flex;
    //align-items: end;
    position: relative;
    .form-check-input {
      cursor: pointer;
      background: ${(props) =>
        props.checked
          ? "rgba(31, 84, 98, 1)"
          : "rgba(150, 156, 157, 0.1)"} !important;
      border-radius: 2px;
      min-width: 20px;
      height: 20px;
      border-color: ${(props) =>
        props.checked ? "rgba(31, 84, 98, 1)" : "#E0E0E0"};
      position: absolute;
      &:focus {
        outline: none;
        box-shadow: none;
      }
    }

    label {
      margin-left: 0.6rem;
      font-family: Manrope;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 22px;
      letter-spacing: 0.02em;
      color: #393d3e;
    }
  }
`;
