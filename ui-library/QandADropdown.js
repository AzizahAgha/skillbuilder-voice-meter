import React from "react";
import styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";

const QandADropdown = ({
  value,
  setValue,
  type,
  readOnly = false,
  label,
  fromAnswerEditor,
}) => {
  const MenuItems = (type) => {
    switch (type) {
      case "Importance":
        return [
          "Low Importance",
          "Slight Importance",
          "Important",
          "High Importance",
          "Extreme Importance",
        ];

      case "Differentiation":
        return [
          "Low Differentiation",
          "Slight Differentiation",
          "Differentiated",
          "High Differentiation",
          "Extreme Differentiation",
        ];

      case "Confidence":
        return [
          "Low Confidence",
          "Slight Confidence",
          "Confident",
          "High Confidence",
          "Extreme Confidence",
        ];
    }
  };

  return (
    <StyledDropdown disabled={readOnly} className="bs">
      <StyledDropdownButton
        variant="success"
        id="dropdown-basic"
        disabled={readOnly}
        fromAnswerEditor={fromAnswerEditor}
      >
        {`${value}/5 ${label}`}
      </StyledDropdownButton>

      <StyledDropdownMenu>
        <Dropdown.ItemText>{type}</Dropdown.ItemText>
        {MenuItems(type)?.map((e, index) => (
          <StyledDropdownItem
            onClick={() => setValue(Number(index + 1))}
            selected={index + 1 === value ? "true" : "false"}
            key={`StyledDropdownQA${index}`}
          >
            {`${index + 1}/5 ${e}`}
          </StyledDropdownItem>
        ))}
      </StyledDropdownMenu>
    </StyledDropdown>
  );
};

export default QandADropdown;

const StyledDropdown = styled(Dropdown)`
  &&& {
    button {
      &:after {
        display: ${(props) => (props.disabled ? "none" : "")};
        opacity: 0.1;
      }
    }
    &.show {
      button {
        &:after {
          opacity: 1;
        }
      }
    }
  }
`;

const StyledDropdownButton = styled(Dropdown.Toggle)`
  &&& {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    background: transparent;
    border: ${(props) =>
      props.fromAnswerEditor ? "1px solid #969C9D" : "none"};
    font-family: "Barlow Condensed";
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 20px;
    text-align: center;
    color: rgb(31, 84, 98);
    white-space: break-spaces;
    &:disabled {
      opacity: 1;
    }
  }
`;

const StyledDropdownMenu = styled(Dropdown.Menu)`
  &&& {
    // transform: translate(-10%, 40%) !important;
    .dropdown-item-text {
      font-family: "Barlow Condensed";
      font-style: normal;
      font-weight: 500;
      font-size: 30px;
      line-height: 36px;
      color: #1f5462;
    }
  }
`;

const StyledDropdownItem = styled(Dropdown.Item)`
  &&& {
    padding: 0.4rem 1rem;
    font-family: "Manrope";
    font-style: normal;
    font-weight: ${(props) => (props.selected === "true" ? "700" : "400")};
    font-size: 16px;
    line-height: 22px;
    color: #45494a;
    background: ${(props) => (props.selected === "true" ? "#E0F4F4" : "")};
  }
`;
