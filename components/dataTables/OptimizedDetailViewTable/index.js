import React from "react";
import Table from "./Table";
import DetailsQAWrapper from "@ui-library/mobile/DetailsQAWrapper";
import styled from "styled-components";

function DetailViewTable({
  data = [],
  searchKeyword,
  isDetailView = true,
  filters,
  sort,
  refetchData,
  refetchFavourites,
  showOptions = true,
  onHeaderClickHandler,
  handlePageChange,
  totalCount,
  showPagination,
  disableAnswerOptions = false,
  currPageNo,
  nextPage,
  previousPage,
  columnSortingDetails,
  selectedColumn,
}) {
  return (
    <>
      {/* <div className="d-none d-lg-block"> */}
      <div className="d-none d-lg-none d-xl-block ">
        <Table
          data={data}
          searchKeyword={searchKeyword}
          isDetailView={isDetailView}
          filters={filters}
          refetchData={refetchData}
          refetchFavourites={refetchFavourites}
          showOptions={showOptions}
          onHeaderClickHandler={onHeaderClickHandler}
          handlePageChange={handlePageChange}
          totalCount={totalCount}
          showPagination={showPagination}
          disableAnswerOptions={disableAnswerOptions}
          currPageNo={currPageNo}
          nextPage={nextPage}
          previousPage={previousPage}
          columnSortingDetails={columnSortingDetails}
          selectedColumn={selectedColumn}
        />
      </div>
      {/* <Wrapper className="d-block d-lg-none my-4"> */}
      <Wrapper className="d-block d-lg-block d-xl-none my-4 ">
        <DetailsQAWrapper
          data={data}
          searchKeyword={searchKeyword}
          isDetailView={isDetailView}
          filters={filters}
          sort={sort}
          handlePageChange={handlePageChange}
          totalCount={totalCount}
          showPagination={showPagination}
          currPageNo={currPageNo}
          nextPage={nextPage}
          previousPage={previousPage}
        />
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  border: 1px solid #969c9d;
`;

export default DetailViewTable;
