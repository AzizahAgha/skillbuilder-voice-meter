import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useFormikContext, getIn } from "formik";
import DataTable from "@ui-library/DataTable";
import TextArea from "./TextArea";
import InfoPopup from "@ui-library/InfoPopup";
import styled from "styled-components";
import FrequencyDropdown from "./FrequencyDropdown";
import ImportanceSlider from "./ImportanceSlider";
import PriorityBadge from "./PriorityBadge";
import TableFooter from "./TableFooter";
import { getInfoText } from "@utils/helpers";
import { useAuthUser } from "@contexts/AuthContext";

const EMPTY_ARR = [];

function Table({ name, handleAdd, handleRemove }) {
  const [showFooter, setShowFooter] = useState(true);
  const { values } = useFormikContext();
  const { auth } = useAuthUser();

  const formikSlice = getIn(values, name) || EMPTY_ARR;
  const [tableRows, setTableRows] = useState(formikSlice);

  useEffect(() => {
    setTableRows(formikSlice);
  }, [formikSlice]);

  const onAdd = useCallback(() => {
    const newState = [...tableRows];
    const item = {
      question: "",
      frequency: "Sometimes",
      importance: 1,
      confidence: 1,
      differentiation: 1,
    };

    newState.push(item);
    setTableRows(newState);
    handleAdd(item);
  }, [handleAdd, tableRows]);

  const onRemove = useCallback(
    (index) => {
      const newState = [...tableRows];

      newState.splice(index, 1);
      setTableRows(newState);
      handleRemove(index);
    },
    [handleRemove, tableRows]
  );

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
        Footer: () => (
          <TableFooter
            onAdd={onAdd}
            // showFooter={showFooter}
            questions={values.questions}
            onWarningDismiss={() =>
              !auth.isAuthenticated && setShowFooter(false)
            }
          />
        ),
      },
      {
        accessor: "question",
        Header: (
          <THContentWrapper>
            <span>
              START HERE: Your Questions{" "}
              <InfoPopup title="Questions" text={getInfoText("question")} />
            </span>
            <small>
              Click on a cell to and start typing your question, we&apos;ll save
              automatically.
            </small>
          </THContentWrapper>
        ),
        Cell: TextArea,
      },
      {
        accessor: "frequency",
        Header: (
          <THContentWrapper className="align-items-center">
            <span>
              Frequency{" "}
              <InfoPopup title="Frequency" text={getInfoText("frequency")} />
            </span>
            <small>(Click cells to edit)</small>
          </THContentWrapper>
        ),
        Cell: FrequencyDropdown,
      },
      {
        accessor: "importance",
        Header: (
          <THContentWrapper className="align-items-center">
            <span>
              Importance{" "}
              <InfoPopup title="Importance" text={getInfoText("importance")} />
            </span>
            <small>(Click cells to edit)</small>
          </THContentWrapper>
        ),
        Cell: ImportanceSlider,
      },
      {
        accessor: "priority",
        Header: (
          <THContentWrapper className="align-items-center">
            <span>
              Priority{" "}
              <InfoPopup title="Priority" text={getInfoText("priority")} />
            </span>
            <small>(Calculated)</small>
          </THContentWrapper>
        ),
        Cell: PriorityBadge,
      },
    ],
    [onAdd, values.questions]
  );

  return (
    <TableWrapper id="question-table">
      <DataTable
        data={tableRows}
        header={tableHeader}
        displayTableIndexHeader={false}
        enableFooter={showFooter}
      />
    </TableWrapper>
  );
}

export default React.memo(Table);

const TableWrapper = styled.div`
  table {
    thead tr {
      th:not(:nth-child(2)) {
        width: 156px;
      }
    }
    tbody tr {
      & td:focus-within {
        border: 2px solid #81c2c0 !important;
      }

      td:nth-child(3),
      td:nth-child(4) {
        vertical-align: middle;
        & > * {
          margin: auto;
        }
      }

      td:nth-child(5) {
        vertical-align: middle;
        & > div {
          justify-content: center;
          margin: 0 auto;
          padding: 0;
        }
      }
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
