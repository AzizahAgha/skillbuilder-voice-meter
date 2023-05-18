import React from 'react';
import { Table } from 'react-bootstrap'
import styled from 'styled-components';
import TextArea from './TextArea';
import InfoPopup from '@ui-library/InfoPopup';;
import FrequencyDropdown from "./FrequencyDropdown";
import ImportanceSlider from "./ImportanceSlider";
import PriorityBadge from "./PriorityBadge";
import { getInfoText } from '@utils/helpers';

export default function AddQuestionPopupSM() {
  return (
    <StyledTable>
      <thead>
        <tr>
          <th>Your Question</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <TextArea />
          </td>
        </tr>
        <tr>
          <td>
            <Option>
              <THContentWrapper>
                <span>Frequency <InfoPopup title='Frequency' text={getInfoText('frequency')} /></span>
                <small>(Click cells to edit)</small>
              </THContentWrapper>
              <FrequencyDropdown />
            </Option>
          </td>
        </tr>
        <tr>
          <td>
            <Option>
              <THContentWrapper>
                <span>Importance <InfoPopup title='Importance' text={getInfoText('importance')} /></span>
                <small>(Click cells to edit)</small>
              </THContentWrapper>
              <ImportanceSlider />
            </Option>
          </td>
        </tr>
        <tr>
          <td>
            <Option>
              <THContentWrapper>
                <span>Priority <InfoPopup title='Priority' text={getInfoText('priority')} /></span>
                <small>(Click cells to edit)</small>
              </THContentWrapper>
              <PriorityBadge />
            </Option>
          </td>
        </tr>
      </tbody>
    </StyledTable>
  );
}

const StyledTable = styled(Table)`
&&& {
  & > :not(:first-child), tbody {
    border: 1px solid #969C9D;
    
  }

  thead {
    th {
      color: #1F5462;
      font-size: 20px;
      font-family: Barlow Condensed;
      font-style: normal;
      font-weight: 500;
      padding-left: 0;
      border: none;
    }

  }
}
`

const Option = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  div {
    margin-top: 0 !important;
  }

  button > span {
    width: auto;
    white-space: nowrap;
    margin-right: 1rem;
  }

  button + div {
    right: 0rem;
    left: auto;
  }
`

const THContentWrapper = styled.span`
  display: flex;
  flex-direction: column;
  color: #1F5462;
  
  small {
    font-family: Manrope;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #393D3E;
    font-weight: 400;
    opacity: 0.5;
  }
`
