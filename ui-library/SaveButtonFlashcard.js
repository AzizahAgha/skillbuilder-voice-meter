import React from "react";
import styled from "styled-components";
import { Button as BsButton } from "react-bootstrap";

const SaveButtonFlashcard = styled(BsButton)`
  &&& {
    background: #81c2c0;
    border: 1px solid #81c2c0;
    border-radius: 5px;
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 500;
    color: #ffffff;
    float: right;
    min-height: 40px;
    min-width: 100px;
    &:hover,
    &:active,
    &:focus {
      background: #8ed0ce;
      border-color: #8ed0ce;
      outline: none;
      box-shadow: none;
    }
  }
`;

export default SaveButtonFlashcard;
