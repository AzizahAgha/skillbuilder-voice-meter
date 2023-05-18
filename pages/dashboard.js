import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import DetailPageHeader from "@ui-library/DetailPageHeader";
import DashboardInfo from "@components/dashboard/DashboardInfo";
import UserActivityTable from "@components/dataTables/UserActivityTable";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { useInfiniteQuery } from "react-query";
import { useTeam } from "@contexts/TeamContext";
import teamService from "@services/team.service";
import { useInView } from "react-intersection-observer";
import Filter from "@components/dashboard/Filter";
import questionService, {
  defaultQuestionFilters,
} from "@services/question.service";
import DetailViewTable from "@components/dataTables/DetailViewTable";
import moment from "moment";
import styled from "styled-components";
import {
  createReactPageFromHTML,
  download,
  generateActivityCSV,
  generateQsCsv,
  getPageFromWebflow,
  printContent,
  printQuestions,
} from "../utils/helpers";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import { SelectionMode, useAppContext } from "@contexts/AppContext";
import { pdf } from "@react-pdf/renderer";
import answerService from "@services/answer.service";
import TableViewTemplate from "@layouts/pdf-templates/TableViewTemplate";
import ConfirmAlert from "@ui-library/ConfirmAlert";
import ActivityTemplate from "@layouts/pdf-templates/ActivityTemplate";
import TokensContextProvider from "@contexts/TokensContext";
function Dashboard() {
  const { team } = useTeam();
  const [filters, setFilters] = useState(undefined);
  const [filter, setFilter] = useState("user-activity"); // selected filter from the options above the table.
  const [dateFilter, setDateFilter] = useState({
    type: "this_week",
  });
  const pageSize = 10;
  // const [page, setPage] = useState(1);
  const { ref, inView } = useInView({
    threshold: 1,
    // delay: 400,
  });
  const { inSelectMode, selectionMode, setSelectionMode, alert } =
    useAppContext();
  const [stats, setStats] = useState({});

  const userActivityQuery = useInfiniteQuery(
    ["user-activity", team?.id, dateFilter],
    ({ pageParam = 1 }) =>
      teamService.getUserActivity({
        teamId: team?.id,
        params: {
          type: dateFilter.type,
          startDate: dateFilter?.dateRange?.startDate || "",
          endDate: dateFilter?.dateRange?.endDate || "",
          page: pageParam,
          size: pageSize,
        },
      }),
    {
      // enabled: false,
      enabled: !!team && filter === "user-activity",
      keepPreviousData: true,
      refetchOnMount: false,
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    }
  );

  const questionsQuery = useInfiniteQuery(
    ["questionnaire-infinite", { teamId: team?.id, filters }],
    ({ pageParam = 1 }) =>
      questionService.getAll({
        teamId: team?.id,
        filters,
        params: { page: pageParam, size: pageSize },
      }),
    {
      enabled: !!team && filter !== "user-activity",
      keepPreviousData: true,
      refetchOnMount: false,
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    }
  );

  const downloadCSV = useCallback(async () => {
    if (filter === "user-activity") {
      const blob = generateActivityCSV(
        userActivityQuery.data?.pages?.flatMap((page) => page.data) ?? []
      );
      download(blob, `${team.teamName}-skillbuilderio.csv`);
    } else {
      const questions =
        questionsQuery?.data?.pages?.flatMap((page) => page.data) ?? [];
      if (questions?.length === 0) {
        let alertDialog = alert.show(
          <ConfirmAlert
            title={"No Questions"}
            message={"No questions to export"}
            onDone={() => alertDialog.close()}
            doneLabel={"OK"}
            showCancel={false}
          />
        );
      } else {
        const answers = await answerService.getAllAnswers(
          team?.id,
          questions?.map((q) => q.questionId)
        );
        const blob = generateQsCsv(questions, answers);
        download(blob, `${team.teamName}-skillbuilderio.csv`);
      }
    }
  }, [
    alert,
    filter,
    questionsQuery?.data?.pages,
    team?.id,
    team?.teamName,
    userActivityQuery?.data?.pages,
  ]);

  const downloadPDF = useCallback(() => {
    if (filter === "user-activity") {
      const PDFDoc = pdf(
        <ActivityTemplate
          stats={stats}
          data={
            userActivityQuery.data?.pages?.flatMap((page) => page.data) ?? []
          }
          onReady={() => {
            (async () => {
              const blob = await PDFDoc.toBlob();
              download(blob, `${team.teamName}-skillbuilderio.pdf`);
            })();
          }}
        />
      );
    } else {
      const questions =
        questionsQuery?.data?.pages?.flatMap((page) => page.data) ?? [];
      if (questions?.length === 0) {
        const alertDialog = alert.show(
          <ConfirmAlert
            title={"No Questions"}
            message={"No questions to export"}
            onDone={() => alertDialog.close()}
            doneLabel={"OK"}
            showCancel={false}
          />
        );
      } else {
        const PDFDoc = pdf(
          <TableViewTemplate
            data={questions}
            onReady={() => {
              (async () => {
                const blob = await PDFDoc.toBlob();
                download(blob, `${team.teamName}-skillbuilderio.pdf`);
              })();
            }}
            teamId={team?.id}
          />
        );
      }
    }
  }, [
    alert,
    filter,
    questionsQuery?.data?.pages,
    stats,
    team?.id,
    team?.teamName,
    userActivityQuery?.data?.pages,
  ]);

  const print = useCallback(() => {
    if (filter === "user-activity") {
      const PDFDoc = pdf(
        <ActivityTemplate
          stats={stats}
          data={
            userActivityQuery.data?.pages?.flatMap((page) => page.data) ?? []
          }
          onReady={() => {
            (async () => {
              const blob = await PDFDoc.toBlob();
              printContent(blob, `${team.teamName}-skillbuilderio.pdf`);
            })();
          }}
        />
      );
    } else {
      const questions =
        questionsQuery?.data?.pages?.flatMap((page) => page.data) ?? [];
      if (questions?.length === 0) {
        const alertDialog = alert.show(
          <ConfirmAlert
            title={"No Questions"}
            message={"No questions to print"}
            onDone={() => alertDialog.close()}
            doneLabel={"OK"}
            showCancel={false}
          />
        );
      } else {
        printQuestions(questions, team?.id);
      }
    }
  }, [
    alert,
    filter,
    questionsQuery?.data?.pages,
    stats,
    team?.id,
    team?.teamName,
    userActivityQuery?.data?.pages,
  ]);

  useEffect(() => {
    if (!inSelectMode) {
      if (selectionMode === SelectionMode.CSV) {
        downloadCSV();
      } else if (selectionMode === SelectionMode.PDF) {
        downloadPDF();
      } else if (selectionMode === SelectionMode.PRINT) {
        print();
      }
      setSelectionMode(null);
    }
  }, [
    downloadCSV,
    downloadPDF,
    inSelectMode,
    print,
    selectionMode,
    setSelectionMode,
  ]);

  useEffect(() => {
    setFilters(formatFilter(filter, dateFilter, stats));
  }, [filter, dateFilter]);

  useEffect(() => {
    if (inView) {
      if (filter === "user-activity") {
        if (userActivityQuery.hasNextPage) userActivityQuery.fetchNextPage();
      } else {
        if (questionsQuery.hasNextPage) questionsQuery.fetchNextPage();
      }
    }
  }, [filter, inView, questionsQuery, userActivityQuery]);

  return (
    <div className="bs">
      <DetailPageHeader />
      <TokensContextProvider>
        <Container>
          <Row>
            <Col>
              <DashboardInfo
                onFilterChange={setDateFilter}
                onStatsFetched={setStats}
              />
            </Col>
          </Row>

          <Row className="mt-5 mb-2">
            <Col>
              <Filter
                value={filter}
                onChange={(val) => {
                  // console.log(val);
                  setFilter(val);
                }}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              {filter === "user-activity" ? (
                <UserActivityTable
                  data={
                    userActivityQuery.data?.pages?.flatMap((page) => page.data) ||
                    []
                  }
                  dateFilter={dateFilter}
                />
              ) : (
                <DetailViewTable
                  data={
                    questionsQuery?.data?.pages?.flatMap((page) => page.data) ||
                    []
                  }
                  filters={filters}
                />
              )}
            </Col>

            {(questionsQuery.isFetchingNextPage ||
              userActivityQuery.isFetchingNextPage) && (
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

            {(questionsQuery.hasNextPage || userActivityQuery.hasNextPage) && (
              <span style={{ visibility: "hidden" }} ref={ref}>
                intersection observer marker
              </span>
            )}
          </Row>
        </Container>
      </TokensContextProvider>
    </div>
  );
}

const LoadingIndicator = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #81c2c0;
  margin-bottom: 2rem;
`;

function formatFilter(filter, dateFilter, stats) {
  switch (filter) {
    case "high-priority":
      return {
        ...defaultQuestionFilters,
        questionFilters: {
          ...defaultQuestionFilters.questionFilters,
          priority: ["High"],
          questionDateRange: {
            questionStartDate: stats.dateRange.start,
            questionEndDate: stats.dateRange.end,
          },
        },
      };

    case "high-risk":
      return {
        ...defaultQuestionFilters,
        answerFilters: {
          ...defaultQuestionFilters.answerFilters,
          risk: ["High"],
          answerDateRange: {
            answerStartDate: stats.dateRange.start,
            answerEndDate: stats.dateRange.end,
          },
        },
      };

    case "newest":
      return {
        ...defaultQuestionFilters,
        questionFilters: {
          ...defaultQuestionFilters.questionFilters,
          questionDateRange: {
            questionStartDate: moment()
              .subtract(29, "days")
              .format("YYYY-MM-DD"),
            questionEndDate: moment().format("YYYY-MM-DD"),
          },
        },
        answerFilters: {
          ...defaultQuestionFilters.answerFilters,

          answerDateRange: {
            answerStartDate: "",
            answerEndDate: "",
          },
        },
        newestSort: true,
      };

    case "flagged":
      return {
        ...defaultQuestionFilters,
        answerFilters: {
          ...defaultQuestionFilters.answerFilters,

          flaggedDateRange: {
            flaggedStartDate: stats.dateRange.start,
            flaggedEndDate: stats.dateRange.end,
          },
        },
      };

    default:
      return undefined;
  }
}

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/dashboard");

  return {
    props: { HEAD, BODY },
  };
}

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "dashboard-placeholder") {
      return <Dashboard />;
    }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export default function DashboardPage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}
