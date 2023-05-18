import React from "react";
import styled from "styled-components";
import {
  OverlayTrigger,
  Popover as BsPopover,
  Button as BsButton,
} from "react-bootstrap";
import { IoIosInformationCircleOutline } from "react-icons/io";

export default function InfoPopup({
  title = "Title",
  text = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae facilis, repudiandae.",
  color = "#323637AD",
}) {
  return (
    <OverlayTrigger
      // trigger="click"
      placement="top"
      overlay={
        <Popover className="pop-over">
          <Popover.Header as="h3">
            <span
              style={{
                color: `${color}`,
              }}
            >
              {title}
            </span>
          </Popover.Header>
          <Popover.Body>{text}</Popover.Body>
        </Popover>
      }
    >
      <Button variant="default">
        <IoIosInformationCircleOutline color={color} size={20} />
      </Button>
    </OverlayTrigger>
  );
}

const Button = styled(BsButton)`
  &&& {
    padding: 0;
    line-height: 0 !important;
  }
`;

const Popover = styled(BsPopover)`
  &&& {
    z-index: 10000;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
    padding: 0.75rem;
    max-width: 200px;
    .popover-header {
      margin: 0;
      background: none;
      padding: 0;
      border: none;

      font-family: "Barlow Condensed";
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 24px;
      color: #1f5462;
    }

    .popover-body {
      padding: 0;
      font-family: "Manrope";
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 19px;
      color: #393d3e;
    }
  }
`;
