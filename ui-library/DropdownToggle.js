import React from 'react';
import styled from 'styled-components';
import Dropdown from "react-bootstrap/Dropdown";

const DropdownToggle = styled(Dropdown.Toggle)`
&&& {
  background-color: transparent;
  border: none;
  box-shadow: none;
  
  &:hover {
    background: transparent;
    box-shadow: none;
  }
  &:focus{
    background: transparent;
    box-shadow: none;
    color: #003647;
    -webkit-box-shadow: none;
  }
  
  &:after  {
    content: none;
  }
  
  &.btn-primary.dropdown-toggle {
    color: #212529;
    background-color: transparent;
    border-color: transparent;
    padding: 0.25rem 1rem;
    width: 100%;
    text-align: inherit;
  }
  
  &.btn-primary.dropdown-toggle:hover {
    background-color: #e9ecef;
  }
}
`;

export default DropdownToggle
