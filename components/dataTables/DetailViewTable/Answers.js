import React, { useState, useEffect } from "react";
import AnswerComponent from "@ui-library/AnswerComponent";
import { useMutation, useInfiniteQuery, useQueryClient } from "react-query";
import answerService from "@services/answer.service";
import { useTeam } from "@contexts/TeamContext";
import transformAnswerForSaving from "@transformers/answerForSaving.transformer";
import styled from "styled-components";
import answerTransformer from "@transformers/answer.transformer";
import { useAuthUser } from "@contexts/AuthContext";
import Bus from "@utils/Bus";
import { useAsyncDebounce } from "react-table";
import { Spinner } from "react-bootstrap";
import { LoadingIndicator } from "pages/detail-old";

function Answers({
  index,
  question,
  updateData,
  isDetailView,
  searchKeyword,
  filters,
  refetchData,
  disableAnswerOptions,
}) {
  const queryClient = useQueryClient();
  const { team, setTeam } = useTeam();
  const [page, setPage] = useState(1);
  const [counter, setCounter] = useState(1);
  const [answers, setAnswers] = useState(null);
  const [totalCount, setTotalCount] = useState();
  const pageSize = 10;
  const {
    auth: { user },
  } = useAuthUser();

  const mutation = useMutation(
    (data) => answerService.create(team.id, question.id, data),
    {
      onSuccess: (res) => {
        const newAnswer = {
          ...answerTransformer(res.data),
          author: {
            id: user.id,
            name: user.firstName.concat(" ", user.lastName),
            picture: user.avtarUrl,
          },
          createdAt: new Date().toString(),
        };

        setTeam((old) => ({
          ...old,
          answersCount: old.answersCount + 1,
        }));

        queryClient.setQueryData(
          [
            "answers",
            {
              teamId: team?.id,
              questionId: question.id,
              filters,
              answerType: "details",
              searchString: searchKeyword,
            },
          ],
          (old) => {
            let copy = { ...old };
            copy.pages[0].count++;
            copy.pages[0].data.unshift(newAnswer);
            return copy;
          }
        );
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const {
    data,
    fetchNextPage,
    refetch: refetchSummaryView,
    isLoading: isAnswersLoading,
  } = useInfiniteQuery(
    [
      "answers",
      {
        teamId: team?.id,
        questionId: question.id,
        filters,
        answerType: "details",
        searchString: searchKeyword,
      },
    ],
    ({ pageParam = 1 }) =>
      answerService.getAll({
        teamId: team.id,
        questionId: question.id,
        filters,
        params: {
          page: pageParam,
          size: pageSize,
          answerType: "details",
          searchString: searchKeyword,
        },
      }),
    {
      enabled: !!user,
      getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
      getPreviousPageParam: (firstPage, allPages) => firstPage.prevCursor,
      refetchOnMount: false,
      onSuccess: (res) => {
        setAnswers(res?.pages?.flatMap((page) => page.data));
        setTotalCount(res?.pages[0]?.count || res?.count);
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  useEffect(() => {
    setAnswers(data?.pages?.flatMap((page) => page.data));
    setTotalCount(data?.pages[0]?.count || data?.count);
  }, [data]);

  const UpdateAnswerData = () => {
    if (answers) {
      updateData(
        index,
        "differentiation",
        answers[counter - 1]?.differentiation
      );
      updateData(index, "confidence", answers[counter - 1]?.confidence);
      updateData(index, "answer", answers[counter - 1]?.text);
      updateData(
        index,
        "aLabels",
        answers[counter - 1]?.labels?.join(" ") ?? ""
      );
      updateData(index, "answerAttachment", answers[counter - 1]?.attachment);
      updateData(index, "answerId", answers[counter - 1]?.answerId);
      updateData(index, "answerAuthorId", answers[counter - 1]?.author?.id);
    }
  };

  useEffect(() => {
    UpdateAnswerData();
  }, [answers, counter]);

  useEffect(() => {
    UpdateAnswerData();
  }, []);

  useEffect(() => {
    if (counter > 1 && team.id) {
      answerService
        .updateView(team.id, answers[counter - 1].id)
        .catch(console.error);
    }
  }, [counter]);

  useEffect(() => {
    if (data && page <= Math.ceil(data.pages[0].count / 10))
      fetchNextPage({ pageParam: page });
  }, [page]);

  const onPrev = () => {
    setCounter((count) => (count - 1 > 0 ? count - 1 : count));
  };
  const onNext = useAsyncDebounce((event) => {
    if (counter < data.pages[0].count) {
      setCounter((count) =>
        count + 1 <= data.pages[0].count ? count + 1 : count
      );
      if (counter % 8 === 0 && counter <= data.pages[0].count) {
        setPage((value) => value + 1);
      }
    }
  }, 700);

  return (
    <Wrapper $isDetailView={isDetailView}>
      {isAnswersLoading ? (
        <LoadingIndicator>
          <Spinner
            animation="border"
            role="status"
            variant="secondary"
            className="me-1"
          />
          Loading...
        </LoadingIndicator>
      ) : (
        <>
          <AnswerComponent
            showFactors={!isDetailView}
            answer={answers ? answers[counter - 1] : null}
            question={question}
            counter={counter}
            setCounter={setCounter}
            totalCount={totalCount}
            onPrev={onPrev}
            onNext={onNext}
            onAdd={(values) => {
              mutation
                .mutateAsync(transformAnswerForSaving(values))
                .then(() => refetchData && refetchData());
            }}
            searchKeyword={searchKeyword}
            filters={filters}
            isDetailView={isDetailView}
            refetchSummaryView={refetchSummaryView}
            refetchData={refetchData}
            disableAnswerOptions={disableAnswerOptions}
          />
        </>
      )}
    </Wrapper>
  );
}

export default React.memo(Answers);

const Wrapper = styled.div`
  max-width: ${(props) => (props.$isDetailView ? "320px" : "600px")};
  word-wrap: break-word;
  & .answer-text {
    max-height: 200px;
    overflow: auto;
  }
  @media (max-width: 1400px) {
    max-width: ${(props) => (props.$isDetailView ? "230px" : "600px")};
  }
  @media (max-width: 1200px) {
    max-width: revert;
  }
`;
