import React, { useMemo } from "react";
import styled from 'styled-components';
import DataTable from '@ui-library/DataTable'
import UserActivityDataTable from '@ui-library/UserActivityDataTable'
import User from "./User";
import ExpandableUserActivity from "@ui-library/ExpandableUserActivity";


export default function UserActivityTable({ data = [], dateFilter }) {

  const tableHeader = useMemo(
    () => [
      {
        accessor: '#',
        Header: '#',
        Cell: ({ row }) =>
          <div className='w-100 text-center'>
            {`${(parseInt(row.id) + 1)}`.padStart(2, '0')}
          </div>,
      },
      {
        accessor: 'user.firstName',
        Header: 'User',
        Cell: ({ row: { original } }) => <User user={original.user} />
      },
      {
        accessor: 'totalQuestions',
        Header: 'Questions'
      },
      {
        accessor: 'totalAnswers',
        Header: 'Answers',
      },
      {
        accessor: 'totalRequests',
        Header: 'Requests',
      },
      {
        accessor: 'totalLikes',
        Header: 'Agrees',
      },
      {
        accessor: 'totalDislikes',
        Header: 'Disagrees',
      },
      {
        accessor: 'totalFlags',
        Header: 'Flags',
      },
      {
        accessor: 'total',
        Header: 'Total',
      },
    ],
    []
  );

  const mTableHeader = useMemo(
    () => [
      {
        Header: "User",
        accessor: "user",
        Cell: ({ row: { original, index } }) => <ExpandableUserActivity data={original} idx={index} dateFilter={dateFilter}/>,
      },
      {
        accessor: 'totalQuestions',
        Header: 'Questions'
      },
    ],
    [dateFilter]
  );

  return (
    <TableWrapper>
      <div className="d-none d-lg-block">
        <DataTable
          data={data}
          header={tableHeader}
          isSortable
        />
      </div>
      <div className="d-blokb d-lg-none">
        <UserActivityDataTable
          data={data}
          header={mTableHeader}
          isSortable
        />
      </div>
    </TableWrapper>
  )
}

const TableWrapper = styled.div`
  margin-bottom: 2rem;
  table {
    border: 1px solid #969C9D;
    thead tr {
      background: #f2f2f2;
    }
    tbody tr {
      background: white !important;
      border: none !important;
      border-bottom: 1px solid #DEDFDF !important;

      td:not(:nth-child(2)) {
        font-family: Barlow Condensed;
        font-style: normal;
        font-weight: normal;
        font-size: 20px;
        line-height: 24px;
        text-align: center;
        color: #003647;
      }

      td:first-child {
        color: #969C9D;
      }

      td {
        border: none !important;
        vertical-align: middle;
      }
    
    }
  }


`
