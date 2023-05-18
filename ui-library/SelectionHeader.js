import React from "react";
import styled from "styled-components";
import Text from "@ui-library/Text";
import Button from "@ui-library/Button";
import DropdownToggle from "@ui-library/DropdownToggle";
import Dropdown from "react-bootstrap/Dropdown";
import { SelectionMode, useAppContext } from "@contexts/AppContext";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 38px;
`;

const Stretch = styled.div`
  flex: 1;
`;

const Txt = styled(Text)`
  font-style: normal;
  font-weight: 500;
  color: #1f5462;
`;

const Title = styled(Txt)`
  font-size: 30px;
  line-height: 36px;
`;

const TextButton = styled(Txt)`
  cursor: pointer;
  font-size: 20px;
  line-height: 24px;
`;

const Divider = styled(Txt)`
  margin-right: 8px;
  margin-left: 8px;
`;

const Counter = styled(Text)`
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

const SelectionHeader = ({
  count = 3,
  onClick,
  onSelectAll,
  onDeselectAll,
}) => {
  const { selectionMode } = useAppContext();

  return (
    <Container>
      <Title>
        Select the questions you want to{" "}
        {selectionMode === SelectionMode.PRINT ? "print" : "download"}.
      </Title>
      <Stretch />
      <TextButton onClick={onSelectAll}>Select All</TextButton>
      <Divider>|</Divider>
      <TextButton onClick={onDeselectAll}>Deselect All</TextButton>
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

export default SelectionHeader;
