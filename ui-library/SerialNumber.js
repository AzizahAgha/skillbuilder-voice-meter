import React, { useState } from "react";
import styled from "styled-components";
import { FiMoreVertical } from "react-icons/fi";
import { BsStar, BsStarFill } from "react-icons/bs";
import { useTeam } from "@contexts/TeamContext";
import Dropdown from "react-bootstrap/Dropdown";
import { Form, Button } from "react-bootstrap";
import { useAppContext } from "@contexts/AppContext";
import answerService from "@services/answer.service";
import TableViewTemplate from "../layouts/pdf-templates/TableViewTemplate";
import { pdf } from "@react-pdf/renderer";
import { download, generateQsCsv } from "@utils/helpers";
import useFavouriteQuestionMutation from "@hooks/useFavouriteQuestionMutation";
import { useAuthUser } from "@contexts/AuthContext";
import questionService from "@services/question.service";
import { useMutation, useQueryClient } from "react-query";
import ConfirmAlert from "@ui-library/ConfirmAlert";
import Alert from "react-bootstrap/Alert";
import { Router, useRouter } from "next/router";
import MergedHistoryPopup from "@components/questionMerge/MergedHistoryPopup";
import { MdOutlineHistory } from "react-icons/md";
import QWatchPopup from "@components/watchQuestion/watchPopup";

const SerialNumber = ({
  value,
  showOptions = false,
  question,
  filters,
  refetchData,
  refetchFavourites,
  mergeId,
  hideSrNo = false,
  view = "column",
}) => {
  const { team, refetchTeam } = useTeam();
  const { auth, auth: { user: { isAdmin,isSuperAdmin } = {} } = {} } = useAuthUser();
  const { inSelectMode, selection, setSelection, alert } = useAppContext();
  const queryClient = useQueryClient();
  const router = useRouter();
  const Actions = {
    Archive: "Archived",
    Unarchive: "Active",
  };

  const QuestionStatusMutation = useMutation(
    ({ teamId, questionId, status }) =>
      questionService.statusUpdate({ teamId, questionId, status }),
    {
      onSettled: () => {
        queryClient.invalidateQueries([
          "questionnaire-infinite",
          { teamId: team?.id, filters },
        ]);
        queryClient.invalidateQueries(["dashboard-stats"]);
        refetchTeam();
      },
    }
  );
  const handleClick = (action) => {
    switch (action) {
      case Actions.Archive:
        const archiveAlert = alert.show(
          <ConfirmAlert
            title={"Are you sure?"}
            message={"The question will be Archived"}
            onDone={() => {
              QuestionStatusMutation.mutate({
                teamId: team?.id,
                questionId: question?.questionId,
                status: action,
              });
            }}
            onCancel={() => archiveAlert.close()}
          />
        );
        break;

      case Actions.Unarchive:
        const unarchiveAlert = alert.show(
          <ConfirmAlert
            title={"Are you sure?"}
            message={"The question will be Unarchived"}
            onDone={() => {
              QuestionStatusMutation.mutate({
                teamId: team?.id,
                questionId: question?.questionId,
                status: action,
              });
            }}
            onCancel={() => unarchiveAlert.close()}
          />
        );
        break;
    }
  };

  const mutation = useFavouriteQuestionMutation(
    question,
    filters,
    refetchData,
    refetchFavourites
  );

  const selected = selection[question.questionId] ?? false;

  const countSelection = () => {
    let selectedArray = [];
    selectedArray = Object.keys(selection).filter((key) => {
      if (selection[key] == true) {
        return key;
      }
    });
    return selectedArray.length == 20;
  };

  const toggleFavourite = () => {
    mutation.mutate({
      teamId: team.id,
      questionId: question.id,
      favorite: !question.isFavorite,
    });
  };

  async function exportCSV() {
    const answers = await answerService.getAllAnswers(team?.id, [
      question?.questionId,
    ]);
    const blob = generateQsCsv([question], answers);
    download(blob, `${team.teamName}-skillbuilderio.csv`);
  }

  const exportPDF = async () => {
    const PDFDoc = pdf(
      <TableViewTemplate
        data={[question]}
        teamId={team.id}
        onReady={async () => {
          const blob = await PDFDoc.toBlob();
          download(blob, `${team.teamName}-skillbuilderio.pdf`);
        }}
      />
    );
  };
  const [showMergedHistoryPopup, setShowMergedHistoryPopup] = useState(false);

  const [showQWatchPopup, setshowQWatchPopup] = useState(false);

  return (
    <Container
      className={view == "column" ? "flex-column p-1" : "flex-row p-0"}
    >
      {!hideSrNo && <span>{`${value}`.padStart(2, "0")}</span>}
      {showOptions && (
        <>
          <Button
            variant="default"
            className={view == "column" ? "p-0 mt-1" : "p-0"}
            onClick={toggleFavourite}
            disabled={question.status == "Archived" || mutation.isLoading}
            style={{ lineHeight: 0 }}
          >
            {question.isFavorite ? (
              <BsStarFill color="#FDE87B" size={20} />
            ) : (
              <BsStar color="#969C9D" size={20} />
            )}
          </Button>
          {mergeId && (
            <>
              <MergedHistoryPopup
                show={showMergedHistoryPopup}
                setShow={setShowMergedHistoryPopup}
                teamId={team?.id}
                mergeId={mergeId}
                mergeType="Question"
              />
              <Button
                variant="default"
                className={view == "column" ? "p-0 mt-1" : "p-0"}
                onClick={() => {
                  setShowMergedHistoryPopup(true);
                }}
              >
                <MdOutlineHistory color="#969C9D" size={20} />
              </Button>
            </>
          )}

          <QWatchPopup
            show={showQWatchPopup}
            setShow={setshowQWatchPopup}
            teamId={team?.id}
            questionId={question?.questionId}
            refetchData={refetchData}
          />
        </>
      )}

      <Stretch />

     
        <React.Fragment>
          {inSelectMode && view != "row" && (
            <FormCheck
              type="checkbox"
              checked={selected}
              onChange={(event) => {
                if (event.target.checked) {
                  setSelection({ ...selection, [question.questionId]: true });
                } else {
                  let tempObj = { ...selection };
                  delete tempObj[question.questionId];
                  setSelection(tempObj);
                }
              }}
              disabled={
                (!selected && countSelection()) || question.status == "Archived"
              }
            />
          )}
          <Stretch />
          {showOptions && (
            <Dropdown>
              <DropdownToggle variant="default">
                <MoreOptions color="#969C9D" />
              </DropdownToggle>

              <Dropdown.Menu>
                {(isAdmin || isSuperAdmin) && question.status === "Active" && (
                  <Dropdown.Item onClick={() => handleClick(Actions.Archive)}>
                    Archive
                  </Dropdown.Item>
                )}

                {question.status === "Active" && (
                  <Dropdown.Item onClick={() => setshowQWatchPopup(true)}>
                    {question?.isWatch ? "Stop" : "Start"} Watching
                  </Dropdown.Item>
                )}
                {question.status === "Active" &&
                  question.is_merge_requested === false && (
                    <Dropdown.Item
                      onClick={() =>
                        router.push(`/question-merge/${question.id}`)
                      }
                    >
                      Merge Questions
                    </Dropdown.Item>
                  )}

                {question.status === "Active" &&
                  question.is_merge_requested === true && (
                    <Dropdown.Item style={{ cursor: "auto" }}>
                      Merge Requested
                    </Dropdown.Item>
                  )}
                {(isAdmin|| isSuperAdmin) && question.status === "Archived" && (
                  <Dropdown.Item onClick={() => handleClick(Actions.Unarchive)}>
                    Unarchive
                  </Dropdown.Item>
                )}
                <Dropdown.Item onClick={exportPDF}>Download PDF</Dropdown.Item>
                <Dropdown.Item onClick={exportCSV}>Download CSV</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </React.Fragment>
     
    </Container>
  );
};

export default SerialNumber;

const Container = styled.div`
  font-family: "Barlow Condensed", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: #393d3e;
  text-align: center;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0.8rem 0;
`;

const MoreOptions = styled(FiMoreVertical)`
  justify-self: end;
`;

const Stretch = styled.div`
  flex: 1;
`;

const FormCheck = styled(Form.Check)`
  &&& {
    input {
      float: none;
      padding: 8px;
      border: 3px solid #1f5462;
      border-radius: 0.6em;

      &[type="checkbox"] {
        border-radius: 0.6em;
      }

      &:checked[type="checkbox"] {
        background: #1f5462;
        border: 3px solid #1f5462;
      }
      &:focus {
        border-color: #1f5462;
        box-shadow: none;
      }
    }
  }
`;

const DropdownToggle = styled(Dropdown.Toggle)`
  &&& {
    background: none;
    border: none;
    box-shadow: none;
    line-height: 0;
    &:hover {
      background: #eaeaea;
    }
    &:focus {
      background: #eaeaea;
    }

    &:after {
      content: none;
    }
  }
`;
