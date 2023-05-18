import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useFormikContext, getIn } from "formik";
import DataTable from "@ui-library/DataTable";
import InfoPopup from "@ui-library/InfoPopup";
import styled from "styled-components";
import ConfidenceSlider from "./ConfidenceSlider";
import DifferentiationSlider from "./DifferentiationSlider";
import Question from "./Question";
import RiskBadge from "./RiskBadge";
import AnswerEditor from "./AnswerEditor";
import TableFooter from "./TableFooter";
import { getInfoText } from "@utils/helpers";
import { useAuthUser } from "@contexts/AuthContext";

const EMPTY_ARR = [];

export default function Answers({ name, handleAdd, handleRemove }) {
  const { values } = useFormikContext();
  const { auth } = useAuthUser();
  const formikSlice = getIn(values, name) || EMPTY_ARR;
  const [tableRows, setTableRows] = useState(formikSlice);

  useEffect(() => {
    setTableRows(formikSlice);
  }, [formikSlice]);

  const onAdd = useCallback((values) => {
    const newState = [...tableRows];
    const item = {
      ...values,
      confidence: 1,
      differentiation: 1,
    };
    newState.push(item);
    setTableRows(newState);
    handleAdd(item);
  }, []);

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
        Footer: () => <TableFooter onAdd={onAdd} />,
      },
      {
        accessor: "question",
        Header: (
          <THContentWrapper>
            <span>
              Your Questions (click cell to edit, add with “+” at bottom)
            </span>
          </THContentWrapper>
        ),
        Cell: Question,
      },
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
            <small>(Click to set)</small>
          </THContentWrapper>
        ),
        Cell: ConfidenceSlider,
      },
      {
        accessor: "differentiation",
        Header: (
          <THContentWrapper
            className="align-items-center"
            
          >
            <span>
              Differentiation{" "}
              <InfoPopup
                title="Differentiation"
                text={getInfoText("differentiation")}
              />
            </span>
            <small>(Click to set)</small>
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
            <small>(Calculated)</small>
          </THContentWrapper>
        ),
        Cell: RiskBadge,
      },
    ],
    [onAdd]
  );

  return (
    <TableWrapper>
      <DataTable
        data={tableRows}
        header={tableHeader}
        displayTableIndexHeader={false}
        enableFooter={!(!auth.isAuthenticated && tableRows.length >= 20)}
      />
    </TableWrapper>
  );
}

const TableWrapper = styled.div`
  .table > :not(caption) > * > * {
    padding: 0;
  }
  table tbody tr {
    &,
    td {
      height: 100%;
    }

    td:nth-child(4),
    td:nth-child(5) {
      vertical-align: middle;
      padding: 0.5rem 0.5rem;
    }

    td:nth-child(6) {
      vertical-align: middle;
      & > div {
        justify-content: center;
        padding: 0;
        margin: auto;
      }
    }
  }
`;

const THContentWrapper = styled.span`
  display: flex;
  flex-direction: column;

  span {
    display: flex;
    align-items: center;
  }

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
