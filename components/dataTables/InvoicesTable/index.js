/* eslint-disable react/jsx-key */
import React, { useMemo, useEffect } from "react";
import { useSortBy, useTable } from "react-table";
import moment from "moment";
import styled from "styled-components";
import Collapse from 'react-bootstrap/Collapse'
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { Dropdown } from "react-bootstrap";
import { valuesIn } from "lodash";
import { Width } from "@utils/helpers";
import { useMediaQuery } from "react-responsive";
import ExpandableIssueDate from "@ui-library/ExpandableIssueDate";

const COLUMNS = [
  {
    Header: "Issue Date",
    accessor: "issueDate",
    Cell: ({ value }) => moment(value).format("MMM DD, YYYY"),
  },
  {
    Header: "Payment",
    accessor: "payment.cardLast4",
    Cell: ({ value }) => {
      if (value) {
        return `************${value}`;
      } else {
        return ``;
      }
    },
  },
  {
    Header: "Description",
    accessor: "description",
  },
  {
    Header: "Price",
    accessor: "price",
    Cell: ({ value }) => `$${value}`,
  },
  {
    Header: "Status",
    accessor: "status",
  },
];

const MCOLUMNS = [
  {
    Header: "Issue Date",
    accessor: "issueDate",
    Cell: ({ row: { original, index } }) => <ExpandableIssueDate data={original} idx={index} />,
  },
  {
    Header: "Payment",
    accessor: "payment.cardLast4",
    Cell: ({ value }) => {
      if (value) {
        return `************${value}`;
      } else {
        return ``;
      }
    },
  }
];
const DropdownEditUsers = (url) => {
  return (
    <Dropdown>
      <StyledDropdown variant="success" id="dropdown-basic">
        ...
      </StyledDropdown>

      <Dropdown.Menu>
        <StyledDropdown_item href={url} download>
          Download{" "}
        </StyledDropdown_item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

function InvoiceTable({ data }) {

  const isTabletOrMobile = useMediaQuery({ maxWidth: Width.mobile });

  const columns = useMemo(() => isTabletOrMobile ? MCOLUMNS : COLUMNS, [isTabletOrMobile]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <StyledTable className="mt-4" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {" "}
                {column.isSorted ? (
                  column.isSortedDesc ? (
                    <BsArrowDown color="#1F5462" />
                  ) : (
                    <BsArrowUp color="#1F5462" />
                  )
                ) : (
                  <BsArrowUp color="#E5E5E5" />
                )}
                {column.render("Header")}
              </th>
            ))}
            <th>
              <BsArrowUp color="#E5E5E5" />
              Action
            </th>
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, idx) => {
          prepareRow(row);
          const { expanded, status, description, price } = data[idx];
          return (
            <>
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
                <td>{DropdownEditUsers(row.original.pdf_link)}</td>
              </tr>
              <tr className="expandable" style={{ display: expanded ? 'table-row' : 'none' }}>
                <td>Description</td>
                <td>{description}</td>
              </tr>
              <tr className="expandable" style={{ display: expanded ? 'table-row' : 'none' }}>
                <td>Price</td>
                <td>${price}</td>
              </tr>
              <tr className="expandable" style={{ display: expanded ? 'table-row' : 'none' }}>
                <td>Status</td>
                <td>{status}</td>
              </tr>
            </>
          );
        })}
      </tbody>
    </StyledTable>
  );
}

export default InvoiceTable;

const StyledTable = styled.table`
  width: 80%;
  margin-left: auto;
  margin-right: auto;

  tbody {
    tr:nth-child(even):not('[class=expandable]') {
      background-color: rgba(150, 156, 157, 0.05);
      border-top: 1px solid #dedfdf;
      border-bottom: 1px solid #dedfdf;
    }
    td {
      text-align: center;
      vertical-align: middle;
      font-family: Manrope;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      // line-height: 19px;
      line-height: 80px;
      color: #393d3e;
    }
  }

  thead {
    th {
      color: #003647;
      font-size: 20px;
      font-family: Barlow Condensed;
      font-style: normal;
      font-weight: 600;
      line-height: 24px;
      text-align: center;
      border: none;
    }
  }

  thead * {
    border: none;
  }

  @media(max-width: 768px){
    width: 90%
  }
`;

const StyledDropdown = styled(Dropdown.Toggle).attrs(() => ({
  id: "dropdown-basic-button",
}))`
  &&& {
    text-align: top;
    background-color: transparent !important;
    border: none !important;
    font-weight: bold !important;
    color: #000000 !important;
    box-shadow: none !important;

    ::after {
      content: none;
    }
    :active {
      background-color: transparent;
    }

    :hover {
      background-color: transparent;
      font-weight: bold;
      color: #000000;
    }
    :active,
    :focus,
    :onclick {
      background-color: transparent;
      border: none;
    }
  }
`;

const StyledDropdown_item = styled(Dropdown.Item).attrs(() => ({}))`
  &&& {
    font-family: Manrope;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    color: #000000;
  }
`;
