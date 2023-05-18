import React, { useState } from "react";
import { Card as BSCard, Modal as BSModal, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import Table from "./Table";
import { useMediaQuery } from "react-responsive";
import answerService from "@services/answer.service";
import { useQuery } from "react-query";
import { useTeam } from "@contexts/TeamContext";

export default function PreviewAllAnswers({ question, refetchSummaryView }) {
  const isTabletOrMobile = useMediaQuery({ maxWidth: 1224 });
  const [showPopup, setShowPopup] = useState(false);
  const { team } = useTeam();

  const {
    data: answers,
    isLoading,
    refetch: refetchPopup,
  } = useQuery(
    [
      "all-answers",
      {
        teamId: team?.id,
        questionId: question?.id,
        answerType: "card",
        type: "all",
      },
    ],
    () =>
      answerService.getAll({
        teamId: team.id,
        questionId: question.id,
        params: {
          type: "all",
          answerType: "card",
        },
      }),
    {
      enabled: showPopup,
      refetchOnMount: true,
    }
  );

  return (
    <div className="bs">
      <StyleButton variant="link" onClick={() => setShowPopup(true)}>
        Preview Existing Answers
      </StyleButton>

      <Modal
        className="bs"
        show={showPopup}
        onHide={() => setShowPopup(false)}
        animation={false}
        size="xl"
      >
        <Card className="bs">
          <CloseButton
            onClick={() => {
              setShowPopup(false);
              refetchSummaryView();
            }}
          >
            <CloseIcon size={24} color="#969C9D" />
          </CloseButton>

          <Card.Body>
            <Card.Title>Question</Card.Title>
            <Card.Text>{question?.text}</Card.Text>

            <Table data={answers?.data} refetchPopup={refetchPopup} />

            {isLoading && (
              <LoadingIndicator>
                <Spinner
                  animation="border"
                  role="status"
                  variant="secondary"
                  style={{ width: "3rem", height: "3rem", marginBottom: 20 }}
                >
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </LoadingIndicator>
            )}
          </Card.Body>
        </Card>
      </Modal>
    </div>
  );
}

const StyleButton = styled.button`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: #81c2c0;
  padding: 0.375rem 0.75rem;
  padding-left: 0;
  border: 0;
  background: none;
`;

const Modal = styled(BSModal)`
  &&& {
    .modal-content {
      background: none;
      border: none;
      display: flex;
      justify-content: end;
    }
  }
`;

const Card = styled(BSCard)`
  &&& {
    .card-title {
      font-family: Barlow Condensed;
      font-style: normal;
      font-weight: 500;
      font-size: 30px;
      line-height: 36px;
      color: #1f5462;
      margin-top: 0.5rem;
    }

    .card-text {
      font-family: Manrope;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 22px;
      color: #393d3e;
    }

    @media (min-width: 1224px) {
      background: #ffffff;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
      border-radius: 5px;
      margin: 1rem;
      min-height: 88vh;
    }
  }
`;
const CloseButton = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  position: absolute;
  right: 12px;
  top: 16px;
`;

const LoadingIndicator = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #81c2c0;
`;
