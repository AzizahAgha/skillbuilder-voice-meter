import React, { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import up from "@public/svgs/up.svg";
import down from "@public/svgs/down.svg";
import styled from "styled-components";
import { useAppContext } from "@contexts/AppContext";
import { Form } from "react-bootstrap";

const Header = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
`;

const FormCheckBox = styled(Form.Check)`
  &&& {
    input {
      float: none;
      padding: 8px;
      border: 3px solid #1f5462;
      border-radius: 0.6em;

      &[type="checkbox"] {
        border-radius: 7.6em;
        margin-right: 12px;
      }

      &:checked[type="checkbox"] {
        background: #1f5462;
        border: 3px solid #1f5462;
      }
      &:focus {
        border-color: #1f5462;
        box-shadow: none;
      }
    }
  }
`;
const Image = styled.img`
  margin: 0 auto;
  max-width: 100%;
  height: auto;
`;

export default function Expandable({
  className,
  header,
  children,
  expanded = false,
  onChange,
  question,
}) {
  const { inSelectMode, selection, setSelection } = useAppContext();
  const [open, setOpen] = useState(expanded);
  const selected = selection[question?.questionId] ?? false;

  const countSelection = () => {
    let selectedArray = [];
    selectedArray = Object.keys(selection).filter((key) => {
      if (selection[key] == true) {
        return key;
      }
    });
    return selectedArray.length == 20;
  };

  return (
    <div className="row">
      <div className="d-flex">
        {inSelectMode && (
          <FormCheckBox
            type="checkbox"
            checked={selected}
            onChange={() =>
              setSelection({ ...selection, [question.questionId]: !selected })
            }
            disabled={!selected && countSelection()}
          />
        )}

        <div className="flex-grow-1">
          <Header
            className={className}
            aria-expanded={open}
            aria-controls="collapseID"
          >
            {header}
            <IconWrapper
              onClick={() => {
                setOpen(!open);
                onChange?.(!open);
              }}
            >
              <Image
                src={open ? up.src : down.src}
                alt="expandable-indicator"
              />
            </IconWrapper>
          </Header>
        </div>
      </div>
      <div className="col-12">
        <Collapse in={open}>
          <div id="collapseID">{children}</div>
        </Collapse>
      </div>
    </div>
  );
}

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;
