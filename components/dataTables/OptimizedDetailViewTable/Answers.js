import React, { useState, useEffect } from "react";
import AnswerComponent from "@ui-library/OptimizedAnswerComponent";
import { useMutation, useQuery } from "react-query";
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
import SliderDropdown from "@ui-library/SliderDropdown";

function Answers({
  question,
  isDetailView,
  searchKeyword,
  filters,
  refetchData,
  disableAnswerOptions,
  auth,
  getConfidenceLabel,
  getDifferentiationLabel,
  submitAnswerUpdate,
  selectedColumn,
}) {
  const { team, setTeam } = useTeam();
  const [page, setPage] = useState(1);
  const [counter, setCounter] = useState(1);
  const [answers, setAnswers] = useState(null);
  const [totalCount, setTotalCount] = useState(Number(question.answerCount));
  const [isPageChange, setIsPageChange] = useState(false);
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
          reactionCount: {
            downVote: 0,
            partyingFace: 0,
            raisedHands: 0,
            smileyFace: 0,
            upVote: 0,
          },
        };

        setTeam((old) => ({
          ...old,
          answersCount: old.answersCount + 1,
        }));

        setAnswers((old) => [newAnswer, ...old]);
        setTotalCount((old) => old + 1);
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const {
    data,
    refetch: refetchSummaryView,
    isLoading: isAnswersLoading,
  } = useQuery(
    [
      "answers",
      {
        teamId: team?.id,
        questionId: question?.id,
        filters,
        answerType: "details",
        searchString: searchKeyword,
        page: page,
      },
    ],
    () =>
      answerService.getAll({
        teamId: team.id,
        questionId: question?.id,
        filters,
        params: !selectedColumn
          ? {
              page: page,
              size: pageSize,
              answerType: "details",
              searchString: searchKeyword,
            }
          : {
              page: page,
              size: pageSize,
              answerType: "details",
              searchString: searchKeyword,
              sortOn: selectedColumn.id,
              sortBy: selectedColumn.sortBy,
            },
      }),
    {
      enabled: !!user,
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
      onSuccess: (res) => {
        if (isPageChange) {
          setAnswers((old) => {
            if (old) {
              let arr = [...old, ...res.data];
              return arr.filter((e, index) => {
                return (
                  index === arr.findIndex((o) => e.answerId === o.answerId)
                );
              });
            } else {
              return res.data;
            }
          });
          setIsPageChange(false);
        } else {
          setAnswers(res.data);
        }

        setTotalCount(res.count);
      },
    }
  );

  useEffect(() => {
    if (counter > 1 && team.id) {
      answerService
        .updateView(team.id, answers[counter - 1].id)
        .catch(console.error);
    }
  }, [counter]);

  const onPrev = () => {
    setCounter((count) => (count - 1 > 0 ? count - 1 : count));
  };
  const onNext = useAsyncDebounce((event) => {
    if (counter < totalCount) {
      setCounter((count) => (count + 1 <= totalCount ? count + 1 : count));
      if (counter % 8 === 0 && counter <= totalCount) {
        if (counter < 10) {
          setPage(2);
          setIsPageChange(true);
        } else {
          setPage(Number(String(Math.abs(counter))[0]) + 2);
          setIsPageChange(true);
        }
        // setPage((page) => page + 1);
      }
    }
  }, 700);

  return (
    <Wrapper $isDetailView={isDetailView}>
      {isAnswersLoading ? (
        <AnswerLoadingIndicator>
          <Spinner
            animation="border"
            role="status"
            variant="secondary"
            className="me-1"
          />
          Loading...
        </AnswerLoadingIndicator>
      ) : (
        <>
          {isDetailView ? (
            <AnswerWrapper>
              <AnswerComponentWrapper>
                <AnswerComponent
                  answers={answers}
                  setAnswers={setAnswers}
                  showFactors={!isDetailView}
                  answer={answers ? answers[counter - 1] : null}
                  question={question}
                  counter={counter}
                  setCounter={setCounter}
                  totalCount={totalCount}
                  onPrev={onPrev}
                  onNext={onNext}
                  onAdd={(values) => {
                    mutation.mutateAsync(transformAnswerForSaving(values));
                  }}
                  searchKeyword={searchKeyword}
                  filters={filters}
                  isDetailView={isDetailView}
                  refetchSummaryView={refetchSummaryView}
                  refetchData={refetchData}
                  disableAnswerOptions={disableAnswerOptions}
                />
              </AnswerComponentWrapper>

              {isDetailView && (
                <>
                  <SliderWrapper style={{ width: "24%" }}>
                    {answers?.length > 0 && (
                      <SliderDropdown
                        type="Confidence"
                        value={answers[counter - 1]?.confidence}
                        label={getConfidenceLabel(
                          answers[counter - 1]?.confidence
                        )}
                        readOnly={
                          auth?.user?.id === answers[counter - 1]?.author.id
                            ? false
                            : true
                        }
                        setValue={(confidence) => {
                          submitAnswerUpdate({
                            answerId: answers[counter - 1].answerId,
                            answer: answers[counter - 1].answerText,
                            confidence: Number(confidence),
                            differentiation:
                              answers[counter - 1].differentiation,
                            attachment: answers[counter - 1].attachment,
                          });

                          answers[counter - 1].confidence = confidence;
                        }}
                      />
                    )}
                  </SliderWrapper>
                  <SliderWrapper style={{ width: "26%" }}>
                    {answers?.length > 0 && (
                      <SliderDropdown
                        type="Differentiation"
                        value={answers[counter - 1]?.differentiation}
                        label={getDifferentiationLabel(
                          answers[counter - 1]?.differentiation
                        )}
                        readOnly={
                          auth?.user?.id === answers[counter - 1]?.author.id
                            ? false
                            : true
                        }
                        setValue={(differentiation) => {
                          submitAnswerUpdate({
                            answerId: answers[counter - 1].answerId,
                            answer: answers[counter - 1].answerText,
                            confidence: answers[counter - 1].confidence,
                            differentiation: Number(differentiation),
                            attachment: answers[counter - 1].attachment,
                          });
                          answers[counter - 1].differentiation =
                            differentiation;
                        }}
                      />
                    )}
                  </SliderWrapper>
                </>
              )}
            </AnswerWrapper>
          ) : (
            <SummaryDiv>
              <AnswerComponent
                setAnswers={setAnswers}
                showFactors={!isDetailView}
                answer={answers ? answers[counter - 1] : null}
                question={question}
                counter={counter}
                setCounter={setCounter}
                totalCount={totalCount}
                onPrev={onPrev}
                onNext={onNext}
                onAdd={(values) => {
                  mutation.mutateAsync(transformAnswerForSaving(values));
                }}
                searchKeyword={searchKeyword}
                filters={filters}
                isDetailView={isDetailView}
                refetchSummaryView={refetchSummaryView}
                refetchData={refetchData}
                disableAnswerOptions={disableAnswerOptions}
              />
            </SummaryDiv>
          )}
        </>
      )}
    </Wrapper>
  );
}

export default React.memo(Answers);

const SummaryDiv = styled.div`
  padding: 0.5rem;
`;

const AnswerLoadingIndicator = styled(LoadingIndicator)`
  &&& {
    justify-content: flex-start;
    margin: 10px;
  }
`;

const Wrapper = styled.div`
  max-width: ${(props) => (props.$isDetailView ? "initial" : "600px")};
  word-wrap: break-word;

  & .answer-text {
    max-height: 200px;
    overflow: auto;
  }
  @media (max-width: 1200px) {
    max-width: revert;
  }
  @media (min-width: 1370px) {
    max-width: ${(props) => (props.$isDetailView ? "initial" : "700px")};
  }
`;
const AnswerWrapper = styled.div`
  display: flex;
  width: 100%;
`;
const AnswerComponentWrapper = styled.div`
  width: 50%;
  max-width: 355px;
  padding: 0.5rem 0.5rem;
  @media (min-width: 1200px) and (max-width: 1365px) {
    max-width: 260px;
  }
`;

const SliderWrapper = styled.div`
  border-left: 1px solid #969c9d;
  padding: 20% 0.5rem;
`;
