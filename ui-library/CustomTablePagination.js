import React from "react";
import styled from "styled-components";
import {
  IoIosArrowDroprightCircle as RightArrow,
  IoIosArrowDropleftCircle as LeftArrow,
} from "react-icons/io";

const CustomTablePagination = ({
  previousPage,
  currPageNo,
  totalCount,
  handlePageChange,
  nextPage,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalCount / 10); i++) {
    if (
      i <= 4 || //the first four pages
      i >= totalCount - 2 || //the last three pages
      (i >= currPageNo - 1 && i <= currPageNo + 1)
    ) {
      //the currentPage, the page before and after
      pageNumbers.push(i);
    } else {
      //any other page should be represented by ...
      pageNumbers.push("dots");
      //jump to the next page to be linked in the navigation
      i = i < currPageNo ? currPageNo - 1 : totalCount - 2;
    }
  }
  return (
    <PaginationWrapper>
      <Pagination>
        <ul className="pagination">
          <li onClick={previousPage} className="previous">
            <a href="javascript:void(0)">
              <LeftArrow size="32" color="#003647" />
            </a>
          </li>
          {pageNumbers.map((number) =>
            number !== "dots" ? (
              <li
                key={number}
                className={number == currPageNo ? "active" : ""}
                onClick={() => handlePageChange(number)}
              >
                <a href="javascript:void(0)">{number}</a>
              </li>
            ) : (
              <li>
                <a href="javascript:void(0)">...</a>
              </li>
            )
          )}
          <li onClick={nextPage} className="next">
            <a href="javascript:void(0)">
              <RightArrow size="32" color="#003647" />
            </a>
          </li>
        </ul>
      </Pagination>
    </PaginationWrapper>
  );
};

export default CustomTablePagination;

const PaginationWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;

  ul {
    margin: 10px;
  }
  .next,
  .previous {
    a {
      border: none;
      padding: 0;
    }
  }
  & li {
    padding: 0.2rem;
    border-radius: 7px;
    padding-bottom: 0px !important;
    a {
      padding: 3px 12px;
      border: 1px solid #003647;
      vertical-align: middle;
      font-family: "Barlow Condensed", sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 26px;
      line-height: 1.2;
      color: #003647;
      border-radius: 6px;
      height: 100%;
      display: block;
      text-decoration: none;
    }
    &.active {
      a {
        background-color: #003647;
        color: #fff !important;
      }
    }
  }
`;
