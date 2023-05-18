import styled from "styled-components";
import { Button } from "react-bootstrap";

const ButtonOutlined = styled(Button).attrs(() => ({
  variant: "outline-primary",
}))`
  &&& {
    display: flex;
    align-items: center;
    justify-content: center;
    border-color: #003647;
    font-family: "Barlow Condensed", sans-serif;

    &:focus {
      outline: none;
      box-shadow: none;
    }
  }
`;

export default ButtonOutlined;
