import React, { useState, useEffect } from "react";
import AnswerComponent from "@ui-library/AnswerComponent";
import { useMutation, useInfiniteQuery, useQueryClient } from "react-query";
import answerService from "@services/answer.service";
import { useTeam } from "@contexts/TeamContext";
import transformAnswerForSaving from "@transformers/answerForSaving.transformer";
import styled from "styled-components";
import { useAuthUser } from "@contexts/AuthContext";
import flashcardService from "@services/flashcard.service";
import { useRouter } from "next/router";
import answerTransformer from "@transformers/answer.transformer";
import Bus from "@utils/Bus";

function Answers({
  index,
  question,
  updateData,
  isDetailView,
  flipcardView = false,
}) {
  const queryClient = useQueryClient();
  const { team, setTeam } = useTeam();
  const [page, setPage] = useState(1);
  const [counter, setCounter] = useState(1);
  const [answers, setAnswers] = useState(null);
  const [totalCount, setTotalCount] = useState();
  const answerpageSize = 10;
  const router = useRouter();
  const {
    auth: { user },
  } = useAuthUser();

  const mutation = useMutation(
    (data) => answerService.create(team.id, question.id, data),
    {
      onSuccess: (res) => {
        console.log(res.data);
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
              // filters,
              answerType: "details",
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
      onError:(error) => {
				Bus.emit("error", { operation: "open",error:error.response});
			}
    }
  );
  useEffect(() => {
    setAnswers(data?.pages?.flatMap((page) => page.data));
    setTotalCount(data?.pages[0]?.count || data?.count);
  }, [data]);

  const {
    data,
    fetchNextPage,
    refetch: refetchSummaryView,
  } = useInfiniteQuery(
    [
      "answers",
      {
        teamId: team?.id,
        questionId: question.id,
        answerType: "details",
      },
    ],
    ({ ansPageParam = 1 }) =>
      answerService.getAll({
        teamId: team.id,
        questionId: question.id,
        params: {
          page: ansPageParam,
          size: answerpageSize,
          answerType: "details",
        },
      }),
    {
      getNextPageParam: () => page,
      refetchOnMount: true,
      onSuccess: (res) => {
        setAnswers(res?.pages?.flatMap((page) => page.data));
        setTotalCount(res?.pages[0]?.count || res?.count);
      },
      onError:(error) => {
				Bus.emit("error", { operation: "open",error:error.response});
			}
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
    if (flipcardView) {
      flashcardLogMutation.mutate({
        newdata: {
          action: "answer",
          questionId: "",
          answerId: answers ? answers[counter - 1] : null,
        },
      });
    }
  };

  const onNext = () => {
    setCounter((count) =>
      count + 1 <= data.pages[0].count ? count + 1 : count
    );
    if (answers.length < data.pages[0].count) {
      setPage((value) => value + 1);
      fetchNextPage();
    }
    if (flipcardView) {
      flashcardLogMutation.mutate({
        newdata: {
          action: "answer",
          questionId: "",
          answerId: answers ? answers[counter - 1] : null,
        },
      });
    }
  };

  const flashcardLogMutation = useMutation(
    ({ data }) =>
      flashcardService.addlogflashcard({
        teamId: team?.id,
        flashcardSetId: router.query.id,
        data,
      }),
    {
      onError:(error) => {
				Bus.emit("error", { operation: "open",error:error.response});
			}
    }
  );

  return (
    <Wrapper $isDetailView={isDetailView} className="answerWrap">
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
          mutation.mutate(transformAnswerForSaving(values));
        }}
        isDetailView={isDetailView}
        refetchSummaryView={refetchSummaryView}
        flipcardView={flipcardView}
      />
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
  @media (max-width: 1300px) {
    max-width: ${(props) => (props.$isDetailView ? "230px" : "600px")};
  }

  @media (max-width: 1200px) {
    max-width: revert;
  }
`;
