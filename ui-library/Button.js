import React from "react";
import styled from "styled-components";

const Button = styled.button`
  &&& {
    min-width: 160px;
    height: 50px;
    background: ${(props) => props.background ?? "#81C2C0"};
    opacity: ${(props) => (props.disabled ? 0.25 : 1)};
    border: ${(props) => `1px solid ${props.background ?? "#81C2C0"}`};
    border-radius: 5px;
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    color: #ffffff;
    cursor: ${(props) => (props.disabled ? "auto" : "pointer")} !important;

    @media (max-width: 1224px) {
      font-size: 16px;
    }
  }
`;

export default Button;
