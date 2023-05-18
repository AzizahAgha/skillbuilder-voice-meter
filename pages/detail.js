import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import DetailViewTable from "@components/dataTables/OptimizedDetailViewTable";
import {
  Button as BsButton,
  ButtonGroup,
  Col,
  Container,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import ButtonOutlined from "@ui-library/ButtonOutlined";
import FiltersModal from "@components/filters/FiltersModal";
import { MdUploadFile } from "react-icons/md";
import { IoSearchOutline, IoAddCircleOutline } from "react-icons/io5";
import { RiQuestionnaireLine } from "react-icons/ri";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useTeam } from "@contexts/TeamContext";
import { useQuery } from "react-query";
import questionService from "@services/question.service";
import DetailPageHeader from "@ui-library/DetailPageHeader";
import favouriteService from "@services/favourite.service";
import { useRouter } from "next/router";
import { DebounceInput } from "react-debounce-input";
import { SelectionMode, useAppContext } from "@contexts/AppContext";
import SelectionFooter from "@ui-library/SelectionFooter";
import SelectionHeader from "@ui-library/SelectionHeader";
import answerService from "@services/answer.service";
import { download, generateQsCsv, printQuestions } from "@utils/helpers";
import { pdf } from "@react-pdf/renderer";
import TableViewTemplate from "@layouts/pdf-templates/TableViewTemplate";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import Head from "next/head";
import { createReactPageFromHTML, getPageFromWebflow } from "../utils/helpers";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Tooltip from "@ui-library/Tooltip";
import { useInView } from "react-intersection-observer";
import Authorization from "@contexts/Authorization";
import Error from "@components/error";
import * as _ from "lodash";
import Select from "@ui-library/Select";
import { useFavourites } from "@contexts/FavouritesContext";
import { useAuthUser } from "@contexts/AuthContext";
import DropdownButton from "react-bootstrap/SplitButton";
import Bus from "@utils/Bus";
import TokensContextProvider from "@contexts/TokensContext";

const options = ["Question No", "Questions", "Frequency", "Importance"];

const AddQuestionsDropDownOptions = () => {
  const router = useRouter();
  return (
    <Col className="d-flex justify-content-end">
      <StyledDropdownButton
        id="dropdown-basic-button"
        title="+ Add Question"
        align="end"
        onClick={() => document.getElementById("btn-add-question").click()}
      >
        <span
          onClick={() => document.getElementById("btn-add-question").click()}
        >
          <IoAddCircleOutline color="#003647" size={20} /> Add Single Question
        </span>
        <span onClick={() => router.push(`/question-bank?type=detail`)}>
          <RiQuestionnaireLine color="#003647" size={20} /> Browse Question Bank
        </span>

        <span onClick={() => router.push(`/questionImport/uploadCsv`)}>
          <MdUploadFile color="#003647" size={20} /> Upload CSV
        </span>
      </StyledDropdownButton>
    </Col>
  );
};

export function Questions() {
  const [selectedColumn, setSelectedColumn] = useState(null);
  const { auth, refetchAuthUser } = useAuthUser();
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState(undefined);
  //const [showFavourites, setShowFavourites] = useState(false);
  const { showFavourites, setShowFavourites } = useFavourites();
  const [isDetailView, setIsDetailView] = useState(true);
  const [sort, setSort] = useState("Question No");
  const [pageNo, setPageNo] = useState(1);

  const pageSize = 10;
  // const [questionsPage, setQuestionsPage] = useState(1);
  // const [favouritePage, setFavouritePage] = useState(1);
  const { ref, inView } = useInView({
    threshold: 1,
    // delay: 400,
  });
  const { team } = useTeam();
  const {
    inSelectMode,
    setInSelectMode,
    selectionMode,
    setSelectionMode,
    selection,
    setSelection,
  } = useAppContext();

  const columnSortInitialValues = new Map([
    ["number", { status: "OFF" }],
    ["questionText", { status: "OFF" }],
    ["frequency", { status: "OFF" }],
    ["importance", { status: "OFF" }],
    ["answerText", { status: "OFF" }],
    ["confidence", { status: "OFF" }],
    ["differentiation", { status: "OFF" }],
  ]);

  const [columnSortingDetails, setColumnSortingDetails] = useState(
    columnSortInitialValues
  );

  const questionsQuery = useQuery(
    [
      "questionnaire-infinite",
      {
        teamId: team?.id,
        filters,
        searchString: searchKeyword,
        setSelectedColumn: selectedColumn,
        pageNo,
      },
    ],
    ({ pageParam = 1 }) =>
      questionService.getAll({
        teamId: team?.id,
        filters,
        params: selectedColumn
          ? {
              page: pageNo,
              size: pageSize,
              searchString: searchKeyword,
              pageType: "details",
              sortOn: selectedColumn.id,
              sortBy: selectedColumn.sortBy,
            }
          : {
              page: pageNo,
              size: pageSize,
              searchString: searchKeyword,
              pageType: "details",
            },
      }),
    {
      enabled: team && auth?.user ? true : false,
      keepPreviousData: true,
      refetchOnMount: false,
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const favouriteQuery = useQuery(
    ["favourite-infinite", { teamId: team?.id, pageNo }],
    ({ pageParam = 1 }) =>
      favouriteService.getAll({
        teamId: team?.id,
        filters,
        params: { page: pageNo, size: pageSize },
      }),
    {
      enabled: team ? true : false,
      keepPreviousData: true,
      refetchOnMount: false,
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );
  const { data: favouriteQueryData } = favouriteQuery;
  const { data: questionsQueryData } = questionsQuery;

  const questionsData = questionsQueryData?.data;
  const favouritesData = favouriteQueryData?.data;

  const downloadCSV = useCallback(
    async (downloadAll = false) => {
      const query = showFavourites ? favouritesData : questionsData;
      const questions = downloadAll
        ? query
        : query?.filter((q) => selection[q.questionId] ?? false);

      const answers = await answerService.getAllAnswers(
        team?.id,
        questions?.map((q) => q.questionId)
      );
      const blob = generateQsCsv(questions, answers);
      download(blob, `${team.teamName}-skillbuilderio.csv`);
    },
    [
      favouritesData,
      questionsData,
      selection,
      showFavourites,
      team?.id,
      team?.teamName,
    ]
  );

  const downloadPDF = useCallback(
    async (downloadAll = false) => {
      const query = showFavourites ? favouritesData : questionsData;
      const questions = downloadAll
        ? query
        : query?.filter((q) => selection[q.questionId] ?? false);

      const PDFDoc = pdf(
        <TableViewTemplate
          data={questions}
          teamId={team?.id}
          onReady={async () => {
            const blob = await PDFDoc.toBlob();
            download(blob, `${team.teamName}-skillbuilderio.pdf`);
          }}
        />
      );
    },
    [
      favouritesData,
      questionsData,
      selection,
      showFavourites,
      team?.id,
      team?.teamName,
    ]
  );

  const printQs = useCallback(
    async (printAll = false) => {
      const query = showFavourites ? favouritesData : questionsData;
      const questions = printAll
        ? query
        : query?.filter((q) => selection[q.questionId] ?? false);

      printQuestions(questions, team?.id);
    },
    [favouritesData, questionsData, selection, showFavourites, team?.id]
  );

  useEffect(() => {
    setShowFavourites(false);
    setSelectedColumn(null);
    setColumnSortingDetails(columnSortInitialValues);
  }, [team]);

  useEffect(() => {
    setPageNo(1);
  }, [auth]);

  useEffect(() => {
    if (!inSelectMode) {
      if (selectionMode === SelectionMode.CSV) {
        downloadCSV(true);
      } else if (selectionMode === SelectionMode.PDF) {
        downloadPDF(true);
      } else if (selectionMode === SelectionMode.PRINT) {
        printQs(true);
      }
      setSelectionMode(null);
    }
  }, [
    downloadCSV,
    downloadPDF,
    inSelectMode,
    printQs,
    selectionMode,
    setSelectionMode,
  ]);

  useEffect(() => {
    if (router.query?.view) setIsDetailView(router.query.view === "detail");
  }, [router.query.view]);

  useEffect(() => {
    refetchAuthUser && refetchAuthUser();
  }, []);

  const count = useMemo(() => {
    return Object.keys(selection)?.reduce((count, key) => {
      return count + (selection[key] ?? false ? 1 : 0);
    }, 0);
  }, [selection]);

  function onSelectAll(selected) {
    const data = showFavourites ? favouritesData : questionsData;
    const selection = {};
    data.forEach((q) => (selection[q.questionId] = selected));
    setSelection(selection);
  }

  const handleDownloadClick = (type) => {
    if (type === SelectionMode.PDF) downloadPDF();
    else if (type === SelectionMode.CSV) downloadCSV();
    else if (type === SelectionMode.PRINT) printQs();
    setSelectionMode(null);
    setInSelectMode(false);
    setSelection({});
  };

  const [flag, setFlag] = useState(true);

  useEffect(() => {
    if (router.query.fromInvite && flag) {
      router.reload();
      setFlag(false);
    }
    if (localStorage.getItem("questionnaire")) {
      localStorage.removeItem("questionnaire");
    }
  }, []);

  const handlePageChange = (page) => {
    setPageNo(page);
  };

  const nextPage = () => {
    let pageLength = showFavourites
      ? favouriteQueryData?.count
      : questionsQueryData?.count;
    if (pageNo !== Math.ceil(pageLength / 10)) setPageNo(pageNo + 1);
  };

  const previousPage = () => {
    if (pageNo !== 1) setPageNo(pageNo - 1);
  };

  const onHeaderClickHandler = (column) => {
    if (column.id === selectedColumn?.id) {
      const status = columnSortingDetails.get(column.id).status;

      switch (status) {
        case "OFF":
          setColumnSortingDetails(
            columnSortingDetails.set(column.id, { status: "ASC" })
          );
          setSelectedColumn({ id: column.id, sortBy: "ASC" });
          break;
        case "ASC":
          setColumnSortingDetails(
            columnSortingDetails.set(column.id, { status: "DESC" })
          );
          setSelectedColumn({ id: column.id, sortBy: "DESC" });
          break;
        case "DESC":
          setColumnSortingDetails(
            columnSortingDetails.set(column.id, { status: "OFF" })
          );
          // setSelectedColumn({ id: column.id, sortBy: "OFF" });
          setSelectedColumn(null);
          break;
      }
    } else {
      if (selectedColumn !== null) {
        // for subsequent times
        let temp = new Map();
        columnSortingDetails.forEach((key, value) => {
          if (value === column.id) {
            temp.set(value, { status: "ASC" });
          } else {
            temp.set(value, { status: "OFF" });
          }
        });
        setColumnSortingDetails(temp);
        setSelectedColumn({ id: column.id, sortBy: "ASC" });
      } else {
        // for 1st time
        setColumnSortingDetails(
          columnSortingDetails.set(column.id, { status: "ASC" })
        );
        setSelectedColumn({ id: column.id, sortBy: "ASC" });
      }
    }
  };

  const sendSelectedColumn = () => {
    if (selectedColumn) {
      if (
        selectedColumn.id === "answerText" ||
        selectedColumn.id === "confidence" ||
        selectedColumn.id === "differentiation"
      ) {
        return selectedColumn;
      }
    } else {
      return null;
    }
  };

  return (
    <Authorization allow={["member"]} fallback={<Error code={401} />}>
      <div className="bs">
        <TokensContextProvider>
          <DetailPageHeader
            onFavouriteClick={() => setShowFavourites((val) => !val)}
            onQuestionClick={() => setShowFavourites(false)}
            showFavourites={showFavourites}
          />

          <Container>
            <Row className="mb-5 align-items-center d-none d-lg-flex" sm={3}>
              <Col className="d-flex">
                <ButtonGroup className="me-2">
                  <StyledButton
                    active={isDetailView}
                    onClick={() =>
                      router.push("?view=detail", undefined, { scroll: false })
                    }
                  >
                    Detail
                  </StyledButton>
                  <StyledButton
                    active={!isDetailView}
                    onClick={() => {
                      router.push("?view=summary", undefined, {
                        scroll: false,
                      });
                      questionsQuery.refetch();
                    }}
                  >
                    Summary
                  </StyledButton>
                </ButtonGroup>

                <FavouriteButton
                  active={showFavourites}
                  onClick={() => {
                    setShowFavourites((val) => !val);
                    favouriteQuery.refetch();
                  }}
                >
                  {showFavourites ? (
                    <AiFillStar color="#FFF" size={20} />
                  ) : (
                    <AiOutlineStar color="#003647" size={20} />
                  )}
                  Favorites (
                  {!favouriteQuery.isError ? favouriteQuery?.data?.count : 0})
                </FavouriteButton>
              </Col>

              <Col className="d-flex">
                <FiltersModal onFiltersChange={setFilters} />

                <StyledInputGroup>
                  <InputGroup.Text>
                    <IoSearchOutline color="#003647" size={20} />
                  </InputGroup.Text>

                  <Input
                    type="search"
                    minLength={2}
                    debounceTimeout={300}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value.trim())}
                    placeholder="Search"
                    className="form-control"
                    key="desktop-search"
                  />

                  {searchKeyword && (
                    <Tooltip text="Clear" placement="right">
                      <ClearButton
                        variant="default"
                        onClick={() => setSearchKeyword("")}
                      >
                        <IoIosCloseCircleOutline color="#969C9D" size={20} />
                      </ClearButton>
                    </Tooltip>
                  )}
                </StyledInputGroup>
              </Col>
              {AddQuestionsDropDownOptions()}
            </Row>
            <div className="mb-3 d-flex d-lg-none justify-content-end">
              <Select
                value={sort}
                onChange={(event) => setSort(event?.target?.value)}
              >
                {options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              {AddQuestionsDropDownOptions()}
            </div>
            <Row className="d-flex d-lg-none">
              <Col>
                <FiltersModal onFiltersChange={setFilters} />
              </Col>

              <Col className="d-flex justify-content-end">
                <StyledInputGroup>
                  <InputGroup.Text>
                    <IoSearchOutline color="#003647" size={20} />
                  </InputGroup.Text>

                  <Input
                    type="search"
                    minLength={2}
                    debounceTimeout={600}
                    value={searchKeyword}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value);
                      questionsQuery.refetch();
                    }}
                    placeholder="Search"
                    className="form-control"
                    key="mobile-search"
                  />

                  {searchKeyword && (
                    <Tooltip text="Clear" placement="right">
                      <ClearButton
                        variant="default"
                        onClick={() => setSearchKeyword("")}
                      >
                        <IoIosCloseCircleOutline color="#969C9D" size={20} />
                      </ClearButton>
                    </Tooltip>
                  )}
                </StyledInputGroup>
              </Col>
            </Row>
            {inSelectMode && (
              <SelectionHeader
                count={count}
                onClick={handleDownloadClick}
                onSelectAll={() => onSelectAll(true)}
                onDeselectAll={() => onSelectAll(false)}
              />
            )}

            {questionsQuery.isLoading ? (
              <LoadingIndicator>
                <Spinner
                  animation="border"
                  role="status"
                  variant="secondary"
                  style={{ width: "3rem", height: "3rem", marginBottom: 20 }}
                >
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </LoadingIndicator>
            ) : (
              <DetailViewTable
                data={
                  showFavourites ? favouritesData || [] : questionsData || []
                }
                searchKeyword={searchKeyword}
                isDetailView={isDetailView}
                filters={filters}
                sort={sort}
                showFavourites={showFavourites}
                refetchFavourites={favouriteQuery.refetch}
                refetchData={questionsQuery.refetch}
                currPageNo={pageNo}
                onHeaderClickHandler={onHeaderClickHandler}
                handlePageChange={handlePageChange}
                totalCount={
                  showFavourites
                    ? favouriteQueryData?.count
                    : questionsQueryData?.count
                }
                showPagination={true}
                nextPage={nextPage}
                previousPage={previousPage}
                columnSortingDetails={columnSortingDetails}
                selectedColumn={sendSelectedColumn()}
              />
            )}
            {(questionsQuery.isFetchingNextPage ||
              favouriteQuery.isFetchingNextPage) && (
              <LoadingIndicator>
                <Spinner
                  animation="border"
                  role="status"
                  variant="secondary"
                  className="me-1"
                >
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                Loading...
              </LoadingIndicator>
            )}

            {(questionsQuery.hasNextPage || favouriteQuery.hasNextPage) && (
              <span style={{ visibility: "hidden" }} ref={ref}>
                intersection observer marker
              </span>
            )}

            {inSelectMode && (
              <SelectionFooter onClick={handleDownloadClick} count={count} />
            )}
            <Wrapper className="d-block d-lg-none">
              <Footer>
                <SaveButton
                  type="button"
                  onClick={() =>
                    document.getElementById("btn-add-question").click()
                  }
                >
                  + Add Question
                </SaveButton>
              </Footer>
            </Wrapper>
          </Container>
        </TokensContextProvider>
      </div>
    </Authorization>
  );
}

export const LoadingIndicator = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #81c2c0;
`;

const FavouriteButton = styled(ButtonOutlined)`
  &:hover svg {
    fill: #fff;
  }
`;

const StyledButton = styled(ButtonOutlined)`
  width: 80px;
`;

const StyledInputGroup = styled(InputGroup)`
  &&& {
    width: fit-content;
    margin-left: 0.5rem;
    color: #003647;
    font-family: "Barlow Condensed", sans-serif;
    border: 0.5px solid #003647;
    border-radius: 0.25rem;
    .input-group-text {
      background: none;
      border: none;
      padding: 0.375rem 0.5rem;
    }
  }
`;

const Input = styled(DebounceInput)`
  &&& {
    border: none;
    padding-left: 0;
  }
`;

const ClearButton = styled(BsButton)`
  &&& {
    display: flex;
    align-items: center;
    padding: 0 0.25rem;
  }
`;

const Button = styled(BsButton)`
  &&& {
    background: #81c2c0;
    border: 1px solid #81c2c0;
    border-radius: 5px;
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 500;
    color: #ffffff;
    float: right;
    &:hover,
    &:active,
    &:focus {
      background: #8ed0ce;
      border-color: #8ed0ce;
      outline: none;
      box-shadow: none;
    }
  }
`;

const Wrapper = styled.div`
  position: relative;
`;

const SaveButton = styled(Button)`
  align-self: end;
  margin-bottom: 25px;
  float: right;

  @media (max-width: 1224px) {
    margin-bottom: 0;
    align-self: center;
    width: 90%;
  }
`;

const Footer = styled.div`
  position: fixed;
  background: white;
  bottom: 0;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  width: 100%;
  left: 0;
  right: 0;
  box-shadow: 0px -26px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 1224px) {
    z-index: 1;
  }
`;

const StyledDropdownButton = styled(DropdownButton).attrs(() => ({
  variant: "secondary",
}))`
  &&& {
    //display: flex;
    //align-items: center;
    //justify-content: flex-end;
    font-family: "Barlow Condensed", sans-serif;
    button {
      font-weight: 500;
      color: #fff;
    }
    .dropdown-menu {
      min-width: 230px;
    }
    .dropdown-toggle-split {
      background: rgb(89, 143, 142);
    }
    span {
      cursor: pointer;
      padding: 4px 12px;
      display: block;
      font-family: "Manrope", sans-serif;
      font-size: 15px;
      line-height: 22px;
      color: #003647;
      &:hover {
        background-color: #ededed;
      }
    }
    &:focus {
      outline: none;
      box-shadow: none;
    }
  }
`;

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "detail-placeholder") {
      return <Questions />;
    }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/detail");

  return {
    props: { HEAD, BODY },
  };
}

export default function DetailPage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}
