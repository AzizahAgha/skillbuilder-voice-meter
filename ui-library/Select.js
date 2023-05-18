import styled from "styled-components";
import { Form } from "react-bootstrap";
import down from "@public/svgs/down.svg";

const Select = styled(Form.Select)`
  &&& {
    border: 1px solid #003647;
    max-width: ${(props) => props.stretched ? 'none' : '120px'};
    border-radius: 5px;
    background-image: url("${down.src}");

    font-family: "Barlow Condensed";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    color: #1f5462;
  }
`;

export default Select;
