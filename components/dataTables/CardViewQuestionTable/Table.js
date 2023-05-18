import React, { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "@ui-library/DataTable";
import InfoPopup from "@ui-library/InfoPopup";
import styled from "styled-components";
import { getImportanceLabel, getInfoText } from "@utils/helpers";
import { BsStar, BsStarFill } from "react-icons/bs";
import QuestionComponent from "@ui-library/QuestionComponent";
import Dropdown, { Options } from "@ui-library/Dropdown";
import useFavouriteQuestionMutation from "@hooks/useFavouriteQuestionMutation";
import { useTeam } from "@contexts/TeamContext";
import Link from "next/link";
import { Wrapper } from "@ui-library/mobile/Wrapper";
import { Factor } from "@ui-library/mobile/Factor";
import { Divider } from "@ui-library/mobile/Divider";
import { Container } from "@ui-library/mobile/Container";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Rules as PriorityRiskRules } from "@ui-library/Priority";
import questionService from "@services/question.service";
import { useMutation } from "react-query";
import SliderDropdown from "@ui-library/SliderDropdown";
import { useAuthUser } from "@contexts/AuthContext";
import Bus from "@utils/Bus";

export default function CardViewQuestionTable({
  data,
  pagination,
  refetchData,
}) {
  const { team } = useTeam();
  const mutation = useFavouriteQuestionMutation(data[0]);
  const { auth } = useAuthUser();
  const [tableData, setTableData] = useState(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  useEffect(() => setSkipPageReset(false), [tableData]);
  useEffect(() => setTableData(data), [data]);

  const updateData = useCallback((rowIndex, columnId, value) => {
    setSkipPageReset(true);
    setTableData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  }, []);

  const toggleFavourite = useCallback(() => {
    mutation.mutate({
      teamId: team.id,
      questionId: data[0].id,
      favorite: !data[0].isFavorite,
    });
  }, [mutation, team?.id, data]);

  const qmutation = useMutation(
    ({ teamId, data }) => questionService.update(teamId, data),
    {
      onSuccess: (res) => {
        //updateData();
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const submitUpdate = (id, questionText, frequency, importance) => {
    qmutation.mutateAsync({
      teamId: team.id,
      data: {
        questions: [
          {
            questionId: id,
            questionText: questionText,
            frequency: frequency,
            importance: Number(importance),
            priority: PriorityRiskRules.Q[frequency][importance].label,
          },
        ],
      },
    });
  };

  const tableHeader = useMemo(
    () => [
      {
        accessor: "questionText",
        Header: (
          <THContentWrapper className="align-items-center"></THContentWrapper>
        ),
        Cell: ({ row: { original, index }, value }) => (
          <QuestionComponent
            id={original.id}
            labels={original.labels}
            frequency={original.frequency}
            importance={original.importance}
            author={original.author}
            createdAt={original.createdAt}
            value={value}
            isCardView={true}
            mergeId={original.mergeId}
            watchCount={original.watchCount}
          />
        ),
      },
      {
        accessor: "frequency",
        Header: (
          <THContentWrapper className="justify-content-center"></THContentWrapper>
        ),
        Cell: ({ row: { original, index }, column: { id } }) => (
          <div className="d-flex flex-column align-items-center questionHead">
            <div className="label">
              Frequency{" "}
              <InfoPopup title="Frequency" text={getInfoText("frequency")} />
            </div>

            <div className="dropdown">
              <Dropdown
                placeholder="Select One"
                name="frequency"
                value={original.frequency}
                options={Options.Frequency}
                disabled={auth.user.id === original.author.id ? false : true}
                onSelect={({ frequency }) => {
                  updateData(index, id, frequency);
                  submitUpdate(
                    original.id,
                    original.questionText,
                    frequency,
                    Number(original.importance)
                  );
                }}
              />
            </div>
          </div>
        ),
      },
      {
        accessor: "importance",
        Header: (
          <THContentWrapper className="justify-content-center"></THContentWrapper>
        ),
        Cell: ({ row: { original, index }, column: { id } }) => (
          <div className="d-flex flex-column align-items-center questionHead">
            <div className="label">
              Importance{" "}
              <InfoPopup title="Importance" text={getInfoText("importance")} />
            </div>

            <div className="dropdown-importance">
              <SliderDropdown
                type="Importance"
                value={original.importance}
                label={getImportanceLabel(original.importance)}
                readOnly={auth.user.id === original.author.id ? false : true}
                setValue={(importance) => {
                  updateData(index, id, importance);
                  submitUpdate(
                    original.id,
                    original.questionText,
                    original.frequency,
                    Number(importance)
                  );
                }}
              />
            </div>
          </div>
        ),
      },
    ],
    [
      data,
      pagination?.nextQuestionId,
      pagination?.prevQuestionId,
      toggleFavourite,
    ]
  );

  const [question] = data;
  const [mobileFrequency, setMobileFrequency] = useState(question?.frequency);
  const [mobileImportance, setMobileImportance] = useState(
    question?.importance
  );
  const [mobileQuestionTxt, setmobileQuestionTxt] = useState(
    question?.questionText
  );

  return (
    <>
      <div className="d-none d-lg-block">
        <TableWrapper>
          <DataTable
            data={tableData}
            header={tableHeader}
            skipPageReset={skipPageReset}
          />
        </TableWrapper>
      </div>

      {question && (
        <>
          <div className="d-flex d-lg-none align-items-center mb-2">
            <div onClick={toggleFavourite} className="py-2 px-1">
              {data[0].isFavorite ? (
                <BsStarFill color="#FDE87B" size={25} />
              ) : (
                <BsStar color="#969C9D" size={25} />
              )}
            </div>
            <div className="d-flex justify-content-between align-items-center"></div>
            <Label className="px-1">Question {data[0].number}</Label>
            <div className="flex-grow-1" />
            <Link href={`/question/${pagination?.prevQuestionId}`} passHref>
              <a
                style={
                  !pagination?.prevQuestionId ? { pointerEvents: "none" } : null
                }
              >
                <MdKeyboardArrowLeft color="#1F5462" size={36} />
              </a>
            </Link>
            <SmallText>
              {data[0].number} / {pagination.totalQuestions}
            </SmallText>
            <Link href={`/question/${pagination?.nextQuestionId}`} passHref>
              <a
                style={
                  !pagination?.nextQuestionId ? { pointerEvents: "none" } : null
                }
              >
                <MdKeyboardArrowRight color="#1F5462" size={36} />
              </a>
            </Link>
          </div>
          <Wrapper className="d-block d-lg-none pt-2 pb-1 px-2">
            <Container>
              <div className="px-2 py-3">
                <QuestionComponent
                  id={question.id}
                  labels={question.labels}
                  frequency={mobileFrequency}
                  importance={mobileImportance}
                  author={question.author}
                  createdAt={question.createdAt}
                  value={mobileQuestionTxt}
                  refetchData={refetchData}
                  isCardView={true}
                />
              </div>
              <Divider negative={true} />
              <Factor
                label="Frequency"
                info={"frequency"}
                rightView={() => (
                  <Dropdown
                    placeholder="Select One"
                    name="frequency"
                    value={mobileFrequency}
                    disabled={
                      auth.user.id === question.author.id ? false : true
                    }
                    options={Options.Frequency}
                    onSelect={({ frequency }) => {
                      submitUpdate(
                        question.id,
                        mobileQuestionTxt,
                        frequency,
                        Number(mobileImportance)
                      );
                      setMobileFrequency(frequency);
                    }}
                  />
                )}
              />
              <Divider negative={true} />
              <Factor
                label="Importance"
                info={"importance"}
                rightView={() => (
                  <SliderDropdown
                    type="Importance"
                    value={mobileImportance}
                    label={getImportanceLabel(question.importance)}
                    readOnly={
                      auth.user.id === question.author.id ? false : true
                    }
                    setValue={(importance) => {
                      submitUpdate(
                        question.id,
                        mobileQuestionTxt,
                        mobileFrequency,
                        Number(importance)
                      );
                      setMobileImportance(Number(importance));
                    }}
                  />
                )}
              />
            </Container>
          </Wrapper>
        </>
      )}
    </>
  );
}

const TableWrapper = styled.div`
  table {
    thead tr {
      th:not(:nth-child(1)) {
        width: 156px;
      }
    }
    tbody tr {
      td:first-child {
        width: auto !important;
        padding: 1rem !important;
      }

      td:nth-child(2),
      td:nth-child(3) {
        //vertical-align: middle;
        padding: 0;
      }
    }
  }
  .questionHead {
    .label {
      width: 100%;
      background-color: #fafafa;
      padding: 12px 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1f5462;
      font-family: "Barlow Condensed", sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      button {
        margin-left: 6px;
        line-height: 1;
      }
    }
    .dropdown {
      margin-top: 45px;
    }
    .dropdown-importance {
      margin-top: -9px;
    }
  }
`;

const THContentWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const Text = styled.div`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  color: #1f5462;
`;

const Label = styled.div`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  line-height: 30px;
  color: #1f5462;
`;
const SmallText = styled.div`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  line-height: 30px;
  color: #393d3e;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
`;
