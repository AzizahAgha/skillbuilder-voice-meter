import React, { useMemo } from 'react'
import styled from 'styled-components';
import DataTable from '@ui-library/DataTable';
import InfoPopup from '@ui-library/InfoPopup';;
import TextArea from './TextArea';
import FrequencyDropdown from "./FrequencyDropdown";
import ImportanceSlider from "./ImportanceSlider";
import PriorityBadge from "./PriorityBadge";
import { getInfoText } from '@utils/helpers';

export default function Table() {

  const tableHeader = useMemo(
    () => [
      {
        accessor: 'question',
        Header: <THContentWrapper>
          <span>Your Question</span>
        </THContentWrapper>,
        Cell: TextArea,
      },
      {
        accessor: 'frequency',
        Header: <THContentWrapper className='align-items-center'>
          <span>Frequency <InfoPopup title='Frequency' text={getInfoText('frequency')} /></span>
          <small>(Click cells to edit)</small>
        </THContentWrapper>,
        Cell: FrequencyDropdown
      },
      {
        accessor: 'importance',
        Header: <THContentWrapper className='align-items-center'>
          <span>Importance <InfoPopup title='Importance' text={getInfoText('importance')} /></span>
          <small>(Click cells to edit)</small>
        </THContentWrapper>,
        Cell: ImportanceSlider
      },
      {
        accessor: 'priority',
        Header: <THContentWrapper className='align-items-center'>
          <span>Priority <InfoPopup title='Priority' text={getInfoText('priority')} /></span>
          <small>(Calculated)</small>
        </THContentWrapper>,
        Cell: PriorityBadge
      }
    ],
    []
  );

  return (
    <TableWrapper>
      <DataTable 
        data={[{ question: '', frequency: 1, importance: 1 }]}
        header={tableHeader}
        enableFooter={false}
        stripedStartOddRow={false}
      />
    </TableWrapper>
  )
}


const TableWrapper = styled.div`
  table tbody tr {
    td:nth-child(2),
    td:nth-child(3),
    td:nth-child(4) {
      vertical-align: middle;
      & > div { justify-content: center; }
    }
  }
`

const THContentWrapper = styled.span`
  display: flex;
  flex-direction: column;
  
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
