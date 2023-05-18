import React, { useMemo } from "react";
import styled from "styled-components";
import DataTable from "@ui-library/DataTable";
import InfoPopup from "@ui-library/InfoPopup";
import AnswerEditor from "./AnswerEditor";
import ConfidenceSlider from "./ConfidenceSlider";
import DifferentiationSlider from "./DifferentiationSlider";
import RiskBadge from "./RiskBadge";
import { getInfoText } from "@utils/helpers";
import { Wrapper } from "@ui-library/mobile/Wrapper";
import Answer from "@components/mobile/Answer";
import { Title } from "@ui-library/mobile/Title";

export default function Table() {
  const tableHeader = useMemo(
    () => [
      {
        accessor: "answer",
        Header: (
          <THContentWrapper>
            <span>Give Your Best Answer</span>
          </THContentWrapper>
        ),
        Cell: AnswerEditor,
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
      {
        accessor: "risk",
        Header: (
          <THContentWrapper className="align-items-center">
            <span>
              Risk <InfoPopup title="Risk" text={getInfoText("risk")} />
            </span>
          </THContentWrapper>
        ),
        Cell: RiskBadge,
      },
    ],
    []
  );

  return (
    <>
      <div className="d-none d-lg-block">
        <TableWrapper>
          <DataTable
            data={[{ question: "", frequency: 1, importance: 1 }]}
            header={tableHeader}
            enableFooter={false}
            stripedStartOddRow={false}
          />
        </TableWrapper>
      </div>
      <div className="d-block d-lg-none mt-3 mb-2">
        <Title className="mt-3 mb-2">Give Your Best Answer</Title>
        <Wrapper>
          <AnswerEditor />
        </Wrapper>
        <div className="d-flex align-items-center mt-3 mb-2">
          <Title>Confidence</Title>
          <InfoPopup title="Confidence" text={getInfoText("confidence")} />
        </div>
        <ConfidenceSlider />
        <div className="d-flex align-items-center mt-3 mb-2">
          <Title>Differentiation</Title>
          <InfoPopup
            title="Differentiation"
            text={getInfoText("differentiation")}
          />
        </div>
        <DifferentiationSlider />
        <div className="d-flex align-items-center mt-3 mb-2">
          <Title>Risk</Title>
          <InfoPopup title="Risk" text={getInfoText("risk")} />
        </div>
        <Wrapper className="p-2">
          <RiskBadge />
        </Wrapper>
      </div>
    </>
  );
}

const TableWrapper = styled.div`
  &&& {
    table {
      thead tr th {
        &:nth-child(3) {
          width: 162px;
        }
      }
      tbody tr {
        td {
          background: white;
        }
        td:first-child {
          //height: 230px;
          max-width: 330px;
          min-width: 330px;

          .ql-editor {
            max-height: 150px;
          }
        }
        textarea {
          height: 90%;
        }
        td:nth-child(2),
        td:nth-child(3),
        td:nth-child(4) {
          vertical-align: middle;
          & > div {
            justify-content: center;
            margin: auto;
          }
        }
      }
    }
    .DraftEditor-root {
      height: 100px;
      overflow-y: scroll;
    }
  }
`;

const THContentWrapper = styled.span`
  display: flex;
  flex-direction: column;

  small {
    font-family: Manrope;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #393d3e;
    font-weight: 400;
    opacity: 0.5;
  }
`;
