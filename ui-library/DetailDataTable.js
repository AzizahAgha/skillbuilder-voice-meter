import React, { useMemo, useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import { Table } from "react-bootstrap";
import styled from "styled-components";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import CustomTablePagination from "./CustomTablePagination";
import InfoPopup from "@ui-library/InfoPopup";
import { getInfoText } from "@utils/helpers";

export default function DetailDataTable({
  header,
  data,
  isSortable = false,
  displayTableIndexHeader = true,
  enableFooter = false,
  stripedStartOddRow = true,
  enableGlobalSearchFilter = false,
  searchKeyword = null,
  skipPageReset = false,
  handlePageChange,
  totalCount,
  showPagination,
  currPageNo,
  nextPage,
  previousPage,
  onHeaderClickHandler,
  columnSortingDetails,
  isDetailView,
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
      autoResetGlobalFilter: false,
      autoResetSortBy: false,
    },
    useGlobalFilter
    // useSortBy
  );

  const onSearchKeywordChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  useEffect(() => {
    if (enableGlobalSearchFilter) {
      onSearchKeywordChange(searchKeyword);
    }
  }, [searchKeyword, enableGlobalSearchFilter]);

  const pageCount = Math.abs(totalCount / 10);

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
                  {...column
                    .getHeaderProps
                    // isSortable && column.getSortByToggleProps()
                    ()}
                  className={
                    !displayTableIndexHeader && idx === 0 ? "d-none" : ""
                  }
                  colSpan={!displayTableIndexHeader && idx === 1 ? 2 : 1}
                >
                  {column.id !== "answerText" ? (
                    <StyledColumns
                      columnSortingDetails={columnSortingDetails}
                      column={column}
                      className="th-container"
                      onClick={() => isSortable && onHeaderClickHandler(column)}
                    >
                      {isSortable && (
                        <span className="sort-indicator">
                          {columnSortingDetails.get(column.id)?.status ===
                            "OFF" && <BsArrowUp color="#969C9D" />}
                          {columnSortingDetails.get(column.id)?.status ===
                            "ASC" && <BsArrowUp color="#FFFFFF" />}
                          {columnSortingDetails.get(column.id)?.status ===
                            "DESC" && <BsArrowDown color="#FFFFFF" />}
                        </span>
                      )}
                      <StyledHeader
                        columnSortingDetails={columnSortingDetails}
                        column={column}
                      >
                        {column.render("Header")}
                      </StyledHeader>
                    </StyledColumns>
                  ) : (
                    <StyledCustomHeader>
                      <InnerheaderSectionAnswer
                        columnSortingDetails={columnSortingDetails}
                        column={column}
                        isDetailView={isDetailView}
                        columnName="answerText"
                        className="th-container"
                        onClick={() =>
                          onHeaderClickHandler({ id: "answerText" })
                        }
                      >
                        <span className="sort-indicator">
                          {columnSortingDetails.get("answerText")?.status ===
                            "OFF" && <BsArrowUp color="#969C9D" />}
                          {columnSortingDetails.get("answerText")?.status ===
                            "ASC" && <BsArrowUp color="#969C9D" />}
                          {columnSortingDetails.get("answerText")?.status ===
                            "DESC" && <BsArrowDown color="#FFFFFF" />}
                        </span>
                        <HeadingName>
                          Answers{" "}
                          <InfoPopup
                            title="Answers"
                            text={getInfoText("answer")}
                            color={
                              columnSortingDetails?.get("answerText")
                                ?.status === "OFF"
                                ? "#323637AD"
                                : "white"
                            }
                          />
                        </HeadingName>
                      </InnerheaderSectionAnswer>

                      {isDetailView && (
                        <>
                          <InnerHeaderSection
                            columnSortingDetails={columnSortingDetails}
                            column={column}
                            columnName="confidence"
                            width="24%"
                            minWidth="137px"
                            className="th-container"
                            onClick={() =>
                              onHeaderClickHandler({ id: "confidence" })
                            }
                          >
                            <span className="sort-indicator">
                              {columnSortingDetails.get("confidence")
                                ?.status === "OFF" && (
                                <BsArrowUp color="#969C9D" />
                              )}
                              {columnSortingDetails.get("confidence")
                                ?.status === "ASC" && (
                                <BsArrowUp color="#969C9D" />
                              )}
                              {columnSortingDetails.get("confidence")
                                ?.status === "DESC" && (
                                <BsArrowDown color="#969C9D" />
                              )}
                            </span>
                            <HeadingName>
                              Confidence{" "}
                              <InfoPopup
                                title="Confidence"
                                text={getInfoText("confidence")}
                                color={
                                  columnSortingDetails?.get("confidence")
                                    ?.status === "OFF"
                                    ? "#323637AD"
                                    : "white"
                                }
                              />
                            </HeadingName>
                          </InnerHeaderSection>
                          <InnerHeaderSection
                            columnSortingDetails={columnSortingDetails}
                            column={column}
                            columnName="differentiation"
                            width="26%"
                            minWidth="149px"
                            className="th-container"
                            onClick={() =>
                              onHeaderClickHandler({ id: "differentiation" })
                            }
                          >
                            <span className="sort-indicator">
                              {columnSortingDetails.get("differentiation")
                                ?.status === "OFF" && (
                                <BsArrowUp color="#969C9D" />
                              )}
                              {columnSortingDetails.get("differentiation")
                                ?.status === "ASC" && (
                                <BsArrowUp color="#969C9D" />
                              )}
                              {columnSortingDetails.get("differentiation")
                                ?.status === "DESC" && (
                                <BsArrowDown color="#969C9D" />
                              )}
                            </span>
                            <HeadingName>
                              Differentiation
                              <InfoPopup
                                title="Differentiation"
                                text={getInfoText("differentiation")}
                                color={
                                  columnSortingDetails?.get("differentiation")
                                    ?.status === "OFF"
                                    ? "#323637AD"
                                    : "white"
                                }
                              />
                            </HeadingName>
                          </InnerHeaderSection>
                        </>
                      )}
                    </StyledCustomHeader>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            const { expanded, email, title, department, status, lastActivity } =
              data[i];
            return (
              <React.Fragment key={`DataTable-tr-${i}`}>
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, cell_idx) => {
                    return (
                      <td key={cell_idx} {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
                <tr
                  className="expandable"
                  style={{ display: expanded ? "table-row" : "none" }}
                >
                  <td>Email</td>
                  <td>{email}</td>
                </tr>
                <tr
                  className="expandable"
                  style={{ display: expanded ? "table-row" : "none" }}
                >
                  <td>Title</td>
                  <td>{title}</td>
                </tr>
                <tr
                  className="expandable"
                  style={{ display: expanded ? "table-row" : "none" }}
                >
                  <td>Department</td>
                  <td>{department}</td>
                </tr>
                <tr
                  className="expandable"
                  style={{ display: expanded ? "table-row" : "none" }}
                >
                  <td>Status</td>
                  <td>{status}</td>
                </tr>
                <tr
                  className="expandable"
                  style={{ display: expanded ? "table-row" : "none" }}
                >
                  <td>Last Activity</td>
                  <td>{lastActivity}</td>
                </tr>
              </React.Fragment>
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
      {showPagination && totalCount > 10 && (
        <CustomTablePagination
          previousPage={previousPage}
          currPageNo={currPageNo}
          totalCount={totalCount}
          handlePageChange={handlePageChange}
          nextPage={nextPage}
        />
      )}
    </div>
  );
}

const StyledTable = styled(Table)`
  &&& {
    height: 100%;
    &,
    tr,
    th {
      border-color: #969c9d;
    }

    & > :not(:first-child) {
      border-top: none;
    }

    thead {
      cursor: pointer;
      tr {
        border: none;
      }
      th:nth-child(1),
      th:nth-child(5) {
        border: none;
      }
      th {
        color: #1f5462;
        font-size: 20px;
        font-family: Barlow Condensed;
        font-style: normal;
        font-weight: 500;
        /* white-space: nowrap; */
        user-select: none;
        // padding: 0.5rem 0.1rem;
        padding: 0;
      }
    }

    tbody {
      border-top-width: 0;
      tr:nth-child(${(props) => props.stripeindex}):not("[class=expandable]") {
        background: rgba(150, 156, 157, 0.05);
      }

      tr td:first-child {
        color: #969c9d;
        font-size: 22px;
        padding: 0;
        font-family: Barlow Condensed;
        font-style: normal;
        font-weight: 500;
        min-width: 48px;
        width: 48px;
      }
      tr {
        height: 100%;
      }
      td {
        height: 100%;
      }
      td:nth-child(3) {
        padding: 0;
      }
    }

    tfoot > tr > td:not(:first-child) {
      display: none;
    }
  }
`;

const StyledCustomHeader = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 100%;
`;
const StyledHeader = styled.span`
  svg {
    path {
      fill: ${(props) =>
        props.columnSortingDetails?.get(props.column.id)?.status === "OFF"
          ? "#323637AD"
          : "white"};
    }
  }
`;
const StyledColumns = styled.div`
  height: 100%;
  padding: 0.5rem 0.1rem;
  background-color: ${(props) =>
    props.columnSortingDetails?.get(props.column.id)?.status === "OFF"
      ? "#e0f4f4"
      : "#1f5462"};
  color: ${(props) =>
    props.columnSortingDetails?.get(props.column.id)?.status === "OFF"
      ? "#1f5462"
      : "white"};
  align-items: "center";
`;

const InnerHeaderSection = styled.div`
  min-width: ${(props) => props.minWidth};
  @media (min-width: 1200px) and (max-width: 1365px) {
    min-width: ${(props) =>
      props.columnName === "differentiation" ? "162px" : "134px"};
  }
  width: ${(props) => props.width};
  color: ${(props) =>
    props.columnSortingDetails?.get(props.columnName)?.status === "OFF"
      ? "#1f5462"
      : "white"};
  background-color: ${(props) =>
    props.columnSortingDetails?.get(props.columnName)?.status === "OFF"
      ? "#e0f4f4"
      : "#1f5462"};
  justify-content: center;
  border-left: 1px solid #969c9d;
  align-items: center;
  padding: 0.5rem 0.1rem;
`;
const InnerheaderSectionAnswer = styled.div`
  @media (min-width: 1200px) and (max-width: 1365px) {
    max-width: 260px;
  }
  width: ${(props) => (props.isDetailView ? "50%" : "100%")};
  align-items: center;
  color: ${(props) =>
    props.columnSortingDetails?.get(props.columnName)?.status === "OFF"
      ? "#1f5462"
      : "white"};
  background-color: ${(props) =>
    props.columnSortingDetails?.get(props.columnName)?.status === "OFF"
      ? "#e0f4f4"
      : "#1f5462"};
  padding: 0.5rem 0.1rem;
`;

const HeadingName = styled.span`
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  &&& {
    button {
      line-height: 1.5;
    }
  }
`;
