import React, { useMemo } from 'react'
import styled from 'styled-components'
import DataTable from '@ui-library/DataTable'
import TextArea from '../QuestionnaireTable/TextArea'
import FrequencyDropdown from "../QuestionnaireTable/FrequencyDropdown";
import ImportanceSlider from "../QuestionnaireTable/ImportanceSlider";
import PriorityBadge from "../QuestionnaireTable/PriorityBadge";

export default function Table({ data }) {

  const tableHeader = useMemo(() => [
    {
      accessor: '#',
      Header: '#',
      Cell: () => <div className='w-100 text-center pt-5 px-1'>EX</div>,
    },
    {
      accessor: 'question',
      Header: <THContentWrapper>
        <span>Example Question From A Prospect or Client</span>
      </THContentWrapper>,
      Cell: TextArea
    },
    {
      accessor: 'frequency',
      Header: <THContentWrapper className='align-items-center'>
        <span>Frequency</span>
      </THContentWrapper>,
      Cell: FrequencyDropdown
    },
    {
      accessor: 'importance',
      Header: <THContentWrapper className='align-items-center'>
        <span>Importance</span>
      </THContentWrapper>,
      Cell: ImportanceSlider
    },
    {
      accessor: 'priority',
      Header: <THContentWrapper className='align-items-center'>
        <span>Priority</span>
      </THContentWrapper>,
      Cell: PriorityBadge
    }
  ], [])

  return (
    <TableWrapper>
      <DataTable
        data={data}
        header={tableHeader}
        displayTableIndexHeader={false}
        stripedStartOddRow={false}
      />
    </TableWrapper>
  )
}

const TableWrapper = styled.div`
  table {
    thead tr {
      th:not(:nth-child(2)) { width: 156px; }
    }
    tbody tr {
      & > td:nth-child(2) {
        & textarea {
          color: #AEAEAE;
        }
      }
      td:nth-child(3), 
      td:nth-child(4){
        vertical-align: middle;
      }
      td:nth-child(5) {
        vertical-align: middle;
        & > div { 
          justify-content: center; 
          margin: auto;
        }
      }
    }
  }
`

const THContentWrapper = styled.span`
  display: flex;
  flex-direction: column;
  
  small {
    font-size: 16px;
    color: #393D3E;
    font-weight: 400;
    opacity: 0.5;
  }
`
