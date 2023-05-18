import React from 'react';
import { OverlayTrigger, Tooltip as BsTooltip } from 'react-bootstrap';
import styled from "styled-components";

export default function Tooltip(props) {
  return (
    <OverlayTrigger
      placement="top"
      overlay={(_props) => (
        <StyledTooltip id="button-tooltip" {..._props}>
          {props.text}
        </StyledTooltip>
      )}
      {...props}
    >
      {props.children}
    </OverlayTrigger>
  )
}

const StyledTooltip = styled(BsTooltip)`
	z-index: 1061 !important;
`;