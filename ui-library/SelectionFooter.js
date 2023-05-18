import React from "react";
import styled from "styled-components";
import Button from "@ui-library/Button";
import Text from "@ui-library/Text";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownToggle from "@ui-library/DropdownToggle";
import { SelectionMode, useAppContext } from "@contexts/AppContext";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 38px;
  margin-bottom: 24px;
`;

const Stretch = styled.div`
  flex: 1;
`;

const Counter = styled(Text)`
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: #969c9d;
  margin-left: 32px;
  margin-right: 18px;
`;
const Dropdown_Item = styled(Dropdown.Item)`
  font-family: "Barlow Condensed";
  font-style: normal;
`;

const SelectionFooter = ({ count = 0, onClick = () => {} }) => {
  const { selectionMode } = useAppContext();

  return (
    <Container>
      <Stretch />
      <Counter>{`${count} selected`}</Counter>
      {selectionMode !== SelectionMode.PRINT && (
        <Dropdown>
          <DropdownToggle>
            <Button>Done & Download</Button>
          </DropdownToggle>
          <Dropdown.Menu>
            <Dropdown_Item onClick={() => onClick(SelectionMode.PDF)}>
              Download PDF
            </Dropdown_Item>
            <Dropdown_Item onClick={() => onClick(SelectionMode.CSV)}>
              Download CSV
            </Dropdown_Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
      {selectionMode === SelectionMode.PRINT && (
        <Button onClick={() => onClick(SelectionMode.PRINT)}>
          Done & {selectionMode === SelectionMode.PRINT ? "Print" : "Download"}
        </Button>
      )}
    </Container>
  );
};

export default SelectionFooter;
