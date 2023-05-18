import React, { useEffect, useMemo, useState } from "react";
import DataTable from "@ui-library/DataTable";
import InfoPopup from "@ui-library/InfoPopup";
import styled from "styled-components";
import AddAnswerPopup from "./AddNewAnswer";
import {
  getConfidenceLabel,
  getDifferentiationLabel,
  getInfoText,
} from "@utils/helpers";
import AnswerComponent from "@ui-library/AnswerComponent";
import CardsAnswerWrapper from "@ui-library/mobile/CardAnswerWrapper";
import { Wrapper } from "@ui-library/mobile/Wrapper";
import AnswerSerialNumber from "@ui-library/AnswerSerialNumber";
import { useAuthUser } from "@contexts/AuthContext";
import answerService from "@services/answer.service";
import { useMutation } from "react-query";
import SliderDropdown from "@ui-library/SliderDropdown";
import { useTeam } from "@contexts/TeamContext";
import transformAnswerForSaving from "@transformers/answerForSaving.transformer";

export default function Table({
  data,
  question,
  searchKeyword,
  isTimelineView,
  refetchCardView,
}) {
  const [tableData, setTableData] = useState(data);
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const { auth } = useAuthUser();
  const { team } = useTeam();

  const answerMutation = useMutation(({ teamId, answerId, data }) =>
    answerService.update(teamId, answerId, data)
  );

  useEffect(() => {
    setSkipPageReset(false);
  }, [tableData]);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const submitAnswerUpdate = (values) => {
    answerMutation.mutateAsync({
      teamId: team.id,
      answerId: values?.answerId,
      data: transformAnswerForSaving(values),
    });
  };

  const updateData = (rowIndex, columnId, value) => {
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
  };

  const tableHeader = useMemo(
    () => [
      {
        accessor: "number",
        Header: "#",
        Cell: ({ row }) => (
          <>
            <div className="w-100 text-center pt-2">
              {`${parseInt(row.id) + 1}`.padStart(2, "0")}

              {row.original.mergeId && (
                <AnswerSerialNumber mergeId={row.original.mergeId} />
              )}
            </div>
          </>
        ),

        Footer: (row) => <AddAnswerPopup question={question} />,
      },
      {
        accessor: "text",
        Header: <Title>{`Answers (${data.length})`}</Title>,

        Cell: ({ row: { original, index }, value }) => (
          <CardViewAnswerWrapper>
            <AnswerComponent
              showFactors={false}
              showNavigator={false}
              showAddButton={false}
              answer={original}
              question={question}
              searchKeyword={searchKeyword}
              enableActions
              isTimelineView={isTimelineView}
              refetchCardView={refetchCardView}
            />
          </CardViewAnswerWrapper>
        ),
      },
      {
        accessor: "confidence",
        Header: (
          <THContentWrapper className="align-items-center">
            Confidence{" "}
            <InfoPopup title="Confidence" text={getInfoText("confidence")} />
          </THContentWrapper>
        ),
        Cell: ({ row: { original, index }, column: { id } }) => (
          <>
            {original.confidence && (
              <SliderDropdown
                type="Confidence"
                value={original.confidence}
                label={getConfidenceLabel(original.confidence)}
                readOnly={auth?.user?.id === original.author.id ? false : true}
                setValue={(confidence) => {
                  updateData(index, id, confidence);
                  submitAnswerUpdate({
                    answerId: original.answerId,
                    answer: original.answerText,
                    confidence: Number(confidence),
                    differentiation: original.differentiation,
                    attachment: original.attachment,
                  });
                }}
              />
            )}
          </>
        ),
      },
      {
        accessor: "differentiation",
        Header: (
          <THContentWrapper className="align-items-center">
            Differentiation{" "}
            <InfoPopup
              title="Differentiation"
              text={getInfoText("differentiation")}
            />
          </THContentWrapper>
        ),
        Cell: ({ row: { original, index }, column: { id } }) => (
          <>
            {original.differentiation && (
              <SliderDropdown
                type="Differentiation"
                value={original.differentiation}
                label={getDifferentiationLabel(original.differentiation)}
                readOnly={auth?.user?.id === original.author.id ? false : true}
                setValue={(differentiation) => {
                  updateData(index, id, differentiation);
                  submitAnswerUpdate({
                    answerId: original.answerId,
                    answer: original.answerText,
                    confidence: original.confidence,
                    differentiation: Number(differentiation),
                    attachment: original.attachment,
                  });
                }}
              />
            )}
          </>
        ),
      },
    ],
    [searchKeyword, data, question]
  );

  return (
    <>
      <div className="d-none d-lg-block">
        <TableWrapper>
          <DataTable
            data={tableData}
            header={tableHeader}
            enableFooter
            isSortable
            enableGlobalSearchFilter
            searchKeyword={searchKeyword}
            skipPageReset={skipPageReset}
            displayTableIndexHeader={false}
          />
        </TableWrapper>
      </div>
      <Wrapper className="d-block d-lg-none">
        <CardsAnswerWrapper
          data={tableData}
          searchKeyword={searchKeyword}
          question={question}
        />
      </Wrapper>
    </>
  );
}

const TableWrapper = styled.div`
  table thead tr {
    th:nth-child(2) .sort-indicator {
      display: none;
    }

    th:nth-child(3),
    th:nth-child(4) {
      width: 145px;
    }
  }

  table tbody td {
    background: white;
    &:nth-child(2) {
      padding: 0.8rem;
      max-width: 300px;
    }
  }

  tbody tr {
    td:nth-child(3),
    td:nth-child(4) {
      vertical-align: middle;
    }
  }
`;

const Title = styled.span`
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
`;

const THContentWrapper = styled.span`
  display: inline-flex;
  flex-direction: row;

  span {
    display: flex;
    align-items: center;
  }
`;

const Text = styled.div`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  color: #1f5462;
  padding: 1.5rem;
`;

const CardViewAnswerWrapper = styled.div`
  & .answer-text {
    max-height: 200px;
    overflow: auto;
  }
`;
