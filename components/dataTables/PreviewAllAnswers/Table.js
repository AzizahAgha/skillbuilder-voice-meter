import React, { useMemo } from "react";
import DataTable from "@ui-library/DataTable";
import InfoPopup from "@ui-library/InfoPopup";
import styled from "styled-components";
import ConfidenceSlider from "./ConfidenceSlider";
import DifferentiationSlider from "./DifferentiationSlider";
import AnswerComponent from "@ui-library/AnswerComponent";
import { getInfoText } from "@utils/helpers";
import PreviewAnswer from "@ui-library/mobile/PreviewAnswer";
import { Wrapper } from "@ui-library/mobile/Wrapper";

export default function Answers({ data = [], refetchPopup }) {
  const tableHeader = useMemo(
    () => [
      {
        accessor: "#",
        Header: "#",
        Cell: ({ row }) => (
          <div className="w-100 text-center pt-2">
            {`${parseInt(row.id) + 1}`.padStart(2, "0")}
          </div>
        ),
      },
      {
        accessor: "text",
        Header: (
          <Title>
            <span>Answers &nbsp;({data.length})</span>
          </Title>
        ),
        Cell: ({ row: { original }, value }) => (
          <AnswerComponent
            showFactors={false}
            showNavigator={false}
            showAddButton={false}
            answer={original}
            refetchPopup={refetchPopup}
          />
        ),
      },
      {
        accessor: "confidence",
        Header: (
          <THContentWrapper className="align-items-center">
            <span>
              Confidence{" "}
              <InfoPopup title="Confidence" text={getInfoText("confidence")} />
            </span>
          </THContentWrapper>
        ),
        Cell: ConfidenceSlider,
      },
      {
        accessor: "differentiation",
        Header: (
          <THContentWrapper className="align-items-center">
            <span>
              Differentiation{" "}
              <InfoPopup
                title="Differentiation"
                text={getInfoText("differentiation")}
              />
            </span>
          </THContentWrapper>
        ),
        Cell: DifferentiationSlider,
      },
    ],
    [data]
  );

  return (
    <>
      <div className="d-none d-lg-block">
        <TableWrapper>
          <DataTable
            data={data}
            header={tableHeader}
            displayTableIndexHeader={false}
            isSortable={true}
          />
        </TableWrapper>
      </div>
      <Wrapper className="d-block d-lg-none">
        {data.map((answer, index) => (
          <PreviewAnswer
            key={index}
            answer={answer}
            lastItem={index === data.length - 1}
            expand={index === 0}
          />
        ))}
      </Wrapper>
    </>
  );
}

const Title = styled.span`
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
`;

const THContentWrapper = styled.span`
  display: inline-flex;
  flex-direction: column;

  span {
    display: flex;
    align-items: center;
  }
`;

const TableWrapper = styled.div`
  table thead tr {
    th:nth-child(2) .sort-indicator {
      display: none;
    }

    th:nth-child(3),
    th:nth-child(4) {
      width: 160px;
    }
  }

  table tbody td {
    background: white;
    &:nth-child(2) {
      padding: 0.8rem;
    }
  }

  tbody tr {
    td:nth-child(3),
    td:nth-child(4) {
      vertical-align: middle;
    }
  }
`;
