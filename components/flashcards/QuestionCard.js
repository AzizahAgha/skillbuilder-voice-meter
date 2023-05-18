import React, { useState } from "react";
import Priority from "@ui-library/Priority";
import { Card, Image } from "react-bootstrap";
import { getImportanceLabel } from "@utils/helpers";
import styled from "styled-components";
import AnswersCard from "./AnswersCard";
import Labels from "@ui-library/Labels";
import { FiCopy } from "react-icons/fi";
import MergedHistoryPopup from "@components/questionMerge/MergedHistoryPopup";
import { useTeam } from "@contexts/TeamContext";
import Tooltip from "@ui-library/Tooltip";
import { MdOutlineOpenInNew } from "react-icons/md";
import { useRouter } from "next/router";
const StyledCard = styled.div`
  height: 100%;
  .card {
    background: #ffffff;
    box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin: 0 40px;
    padding: 1.2rem 0;
    border: none;
    height: 100%;
    .card-header,
    .card-footer {
      padding: 0.5rem 1.2rem !important;
      background: transparent;
      border: 0;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card-text {
      display: -webkit-box;
      -webkit-line-clamp: 6;
      -webkit-box-orient: vertical;
      overflow: hidden;
      max-height: 100%;
    }

    a {
      text-decoration: none;
    }
    .card-body {
      padding: 1rem 1.2rem !important;
      .content {
        white-space: pre-wrap;
        overflow-y: auto !important;
      }
    }
    @media (max-width: 768px) {
      margin: 0 20px;
      .card-header {
        .d-flex {
          flex-wrap: wrap;
        }
      }
    }
  }
  .labelsWrap {
    max-height: 50px;
    overflow: hidden;
  }
`;

const Tag = styled.div`
  margin-right: 20px;
  color: #1f5462;
  font-size: 0.9rem;

  & span {
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;

    & strong {
      font-weight: bold;
    }
  }
`;

const Author = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & span {
    margin-left: 6px;
    font-family: Manrope, sans-serif;
    font-style: normal;
    font-size: 12px;
    line-height: 16px;
    color: #1f5462;

    & strong {
      font-weight: bold;
    }
  }
`;

const FlipCardOuter = styled.div`
  width: 100%;
  height: 400px;
  isolation: isolate;
  .flip-card-inner {
    transform-style: preserve-3d;
    transition: 1.2s linear 0.2s;
    position: relative;
    width: inherit;
    height: inherit;
    &.showBack {
      transform: rotateY(180deg);
    }
  }

  .customcard {
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    &.front {
      transform: rotateY(0);
    }

    &.back {
      transform: rotateY(180deg);
    }
  }
  @media (max-width: 992px) {
    height: 450px;
  }
  @media (max-width: 768px) {
    //height: 480px;
  }
`;

const AnswerCardWrapper = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  margin: 0 40px;
  padding: 1.5rem 1.2rem;
  height: 100%;
  .answerWrap {
    max-width: 100% !important;
    height: 100%;
  }
  .answer-text {
    max-height: 110px !important;
  }
  .labelsWrap {
    max-height: 50px;
    overflow: hidden;
  }
  @media (max-width: 768px) {
    margin: 0 20px;
  }
  #btn-add-answer-spl {
    display: none;
  }
`;

const ViewDetails = styled.div`
  cursor: pointer;
  color: #969c9d;
  font-size: 14px;
  margin-right: 15px;
`;

const QuestionCard = ({ question, toggleMode }) => {
  const [showMergedHistoryPopup, setShowMergedHistoryPopup] = useState(false);
  const { team } = useTeam();
  const router = useRouter();
  return (
    <>
      <FlipCardOuter>
        <div className={`flip-card-inner ${toggleMode ? "showBack" : ""}`}>
          <div className="customcard front">
            <StyledCard>
              <Card>
                <Card.Header>
                  <div className="d-flex align-items-center">
                    <Priority
                      type="Q"
                      frequency={question?.frequency}
                      importance={question?.importance}
                      filled={true}
                      showShowFullLabel={true}
                      linebreak={false}
                      showInfoPopUp={true}
                    />

                    {question?.mergeId && (
                      <>
                        <MergedHistoryPopup
                          show={showMergedHistoryPopup}
                          setShow={setShowMergedHistoryPopup}
                          teamId={team?.id}
                          mergeId={question?.mergeId}
                          mergeType="Question"
                        />
                        <ViewDetails
                          isCardView={false}
                          onClick={() => {
                            setShowMergedHistoryPopup(true);
                          }}
                        >
                          <FiCopy color="#969C9D" size={15} />
                          <span> Merged</span>
                        </ViewDetails>
                      </>
                    )}

                    <Tag>
                      <strong>Frequency: </strong> {question?.frequency}
                    </Tag>
                    <Tag>
                      <strong>Importance:</strong>{" "}
                      {getImportanceLabel(question?.importance).split(" ")[0]}
                    </Tag>
                    <Tooltip text="View Details">
                      <ViewDetails
                        onClick={() => {
                          router.push(
                            `/question/${question?.id}?view=timeline`
                          );
                        }}
                      >
                        <MdOutlineOpenInNew color="#969C9D" size={20} />
                      </ViewDetails>
                    </Tooltip>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="content" style={{ height: "100px" }}>
                    {question?.text}
                  </div>
                </Card.Body>
                <Card.Footer className="mb-1 flex-wrap">
                  <Author>
                    {question?.picture && (
                      <Image
                        roundedCircle="true"
                        style={{
                          height: "30px",
                          width: "30px",
                        }}
                        variant="buttom"
                        src={question?.picture}
                        alt={`profile picture of ${question?.name}`}
                      />
                    )}
                    <span>
                      <strong>{question?.name}</strong> | &nbsp;
                      {question?.createdAt
                        ? new Date(question?.createdAt).toString().slice(4, 10)
                        : ""}
                    </span>
                  </Author>
                  <Labels
                    labels={question?.labels !== null ? question?.labels : []}
                    questionId={question?.id}
                    showAddLabel={false}
                    type="question"
                  />
                </Card.Footer>
              </Card>
            </StyledCard>
          </div>
          <div className="customcard back">
            <AnswerCardWrapper>
              <AnswersCard question={question} flipcardView={true} />
            </AnswerCardWrapper>
          </div>
        </div>
      </FlipCardOuter>
    </>
  );
};

export default QuestionCard;
