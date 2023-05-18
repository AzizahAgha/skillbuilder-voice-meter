import styled from "styled-components";
import { Dropdown } from "react-bootstrap";
import React from "react";

const DropdownInvoices = () => {
  return (
    <React.Fragment>
      <Dropdown>
        <StyledDropdown>...</StyledDropdown>

        <Dropdown.Menu>
          <StyledDropdown_item href="#/action-1">Download</StyledDropdown_item>
          <StyledDropdown_item href="#/action-2">Print</StyledDropdown_item>
          <StyledDropdown_item href="#/action-3">Share</StyledDropdown_item>
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

export default DropdownInvoices;

const StyledDropdown = styled(Dropdown.Toggle).attrs(() => ({
  id: "dropdown-basic-button",
  variant: "none",
}))`
  text-align: top;
  background-color: transparent !important;
  border: none !important;
  font-weight: bold !important;
  color: #000000 !important;
  box-shadow: none !important;

  ::after {
    content: none;
  }
  :active {
    background-color: transparent;
  }

  :hover {
    background-color: transparent;
    font-weight: bold;
    color: #000000;
  }
  :active,
  :focus,
  :onclick {
    background-color: transparent;
    border: none;
  }
`;

const StyledDropdown_item = styled(Dropdown.Item).attrs(() => ({}))`
  font-family: Manrope;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
`;
