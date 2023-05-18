import React, { useMemo, useEffect } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import { Table } from "react-bootstrap";
import styled from "styled-components";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";

export default function DataTable({
  header,
  data,
  isSortable = false,
  displayTableIndexHeader = true,
  enableFooter = false,
  stripedStartOddRow = true,
  enableGlobalSearchFilter = false,
  searchKeyword = null,
  skipPageReset = false,
}) {
  const columns = useMemo(() => header, [header]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      autoResetPage: !skipPageReset,
    },
    useGlobalFilter,
    useSortBy
  );

  const onSearchKeywordChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  useEffect(() => {
    if (enableGlobalSearchFilter) {
      onSearchKeywordChange(searchKeyword);
    }
  }, [searchKeyword, enableGlobalSearchFilter, onSearchKeywordChange]);

  return (
    <div className="bs">
      <StyledTable
        bordered
        {...getTableProps()}
        stripeindex={stripedStartOddRow ? "odd" : "even"}
      >
        <thead>
          {headerGroups.map((headerGroup, headerGroup_idx) => (
            <tr key={headerGroup_idx} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx) => (
                <th
                  key={idx}
                  {...column.getHeaderProps(
                    isSortable && column.getSortByToggleProps()
                  )}
                  className={
                    !displayTableIndexHeader && idx === 0 ? "d-none" : ""
                  }
                  colSpan={!displayTableIndexHeader && idx === 1 ? 2 : 1}
                >
                  <div className="th-container">
                    {isSortable && (
                      <span className="sort-indicator">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <BsArrowDown color="#1F5462" />
                          ) : (
                            <BsArrowUp color="#1F5462" />
                          )
                        ) : (
                          <BsArrowUp color="#E5E5E5" />
                        )}
                      </span>
                    )}
                    <span>{column.render("Header")}</span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            const { expanded, totalAnswers, totalRequests, totalLikes, totalDislikes, totalFlags, total } = data[i];
            return (
              <>
                <tr key={i} {...row.getRowProps()}>
                  {row.cells.map((cell, cell_idx) => {
                    return (
                      <td key={cell_idx} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
                <tr className="expandable" style={{ display: expanded ? 'table-row' : 'none' }}>
                  <td>Answers</td>
                  <td>{totalAnswers}</td>
                </tr>
                <tr className="expandable" style={{ display: expanded ? 'table-row' : 'none' }}>
                  <td>Requests</td>
                  <td>{totalRequests}</td>
                </tr>
                <tr className="expandable" style={{ display: expanded ? 'table-row' : 'none' }}>
                  <td>Agrees</td>
                  <td>{totalLikes}</td>
                </tr>
                <tr className="expandable" style={{ display: expanded ? 'table-row' : 'none' }}>
                  <td>Disagrees</td>
                  <td>{totalDislikes}</td>
                </tr>
                <tr className="expandable" style={{ display: expanded ? 'table-row' : 'none' }}>
                  <td>Flags</td>
                  <td>{totalFlags}</td>
                </tr>
                <tr className="expandable" style={{ display: expanded ? 'table-row' : 'none' }}>
                  <td>Total</td>
                  <td>{total}</td>
                </tr>
              </>
            );
          })}
        </tbody>
        {enableFooter && (
          <tfoot>
            {footerGroups &&
              footerGroups.map((group, footerGroup_idx) => (
                <tr {...group.getFooterGroupProps()} key={footerGroup_idx}>
                  {group.headers.map((column, column_idx) => (
                    <td
                      key={column_idx}
                      {...column.getFooterProps()}
                      colSpan={10}
                    >
                      {column.render("Footer")}
                    </td>
                  ))}
                </tr>
              ))}
          </tfoot>
        )}
      </StyledTable>
    </div>
  );
}

const StyledTable = styled(Table)`
  &&& {
    height: 100%;
    &,
    tr {
      border-color: #969c9d;
    }

    & > :not(:first-child) {
      border-top: none;
    }

    thead {
      th {
        color: #1f5462;
        font-size: 20px;
        font-family: Barlow Condensed;
        font-style: normal;
        font-weight: 500;
        /* white-space: nowrap; */
        user-select: none;
        padding: 0.5rem 0.1rem;
      }
    }

    thead * {
      border: none;
    }

    tbody {
      border-top-width: 0;

      tr:nth-child(${(props) => props.stripeindex}):not('[class=expandable]') {
        background: rgba(150, 156, 157, 0.05);
      }
      tr {
        height: 100%;
        border-top: 1px solid #DEDFDF !important;
        border-bottom: 0px solid #DEDFDF !important;
      }
      td {
        /* padding: 0;  */
        height: 100%;
      }
      td:nth-child(2) {
        text-align: end;
        padding-right: 16px;
      }
      tr.expandable {
        border-bottom: 0px solid #DEDFDF !important;
        border-top: 0px solid #DEDFDF !important;
        td:first-child {
          font-family: 'Barlow Condensed';
          font-style: normal;
          font-weight: 500;
          font-size: 16px;
          line-height: 19px;
          text-align: start;
          color: #003647;
        }
        td:nth-child(2) {
          font-family: 'Manrope';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 19px;
          text-align: end;
          color: #393D3E;
        }
      }
    }
  }
`;
