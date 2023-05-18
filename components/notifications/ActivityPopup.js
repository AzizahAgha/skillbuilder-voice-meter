import React, { useState } from "react";
import {
  Modal as BSModal,
  Container,
  Row,
  Col,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import styled from "styled-components";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import Tooltip from "ui-library/Tooltip";
import Button from "@ui-library/Button";
import { Markup } from "interweave";

export default function ActivityPopup({
  showActivityPopup,
  setShowActivityPopup,
  archiveFlashcardMutation,
  choice,
  flashcardSetId,
  teamId,
  requestedName,
  userName,
  flashcardName,
  type,
  questionMergeApprovalMutation,
  refetchActivitesNotifications,
  questionId,
  adminName,
  mergeCount,
  setShowMergeSuccessPopup,
}) {
  const [message, setMessage] = useState(
    "Unfortunately, we couldn't complete your task, please reach out to your Team Admin to get additional details"
  );
  const contentTop = `${requestedName} -` + "\n" + "\n";
  const contentBot = "\n" + "Thanks," + "\n" + `${userName}`;
  return (
    <Modal
      className="bs"
      show={showActivityPopup}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Container fluid>
        <Row>
          <Col>
            <Card choice={choice}>
              <Header>
                {" "}
                {choice}{" "}
                {type === "Flashcard"
                  ? "Flashcard Archive"
                  : type === "Question"
                  ? "Question Merge"
                  : "Answer Merge"}{" "}
                Request
              </Header>

              <StyledText>
                {type === "Flashcard" &&
                  (choice === "Decline"
                    ? `Let ${requestedName} know why you have rejected this request.`
                    : `You are accepting the request for Flashcard -${flashcardName}`)}
                {type === "Question" &&
                  (choice === "Decline"
                    ? `You are declining the Question Merge Request by  ${requestedName} `
                    : `You are accepting the Question Merge Request by  ${requestedName} `)}

                {type === "Answer" &&
                  (choice === "Decline"
                    ? `You are declining the Answer Merge Request by  ${requestedName} `
                    : `You are accepting the Answer Merge Request by  ${requestedName} `)}
              </StyledText>
              <Tooltip text="Close" placement="left">
                <CloseButton
                  type="button"
                  onClick={() => setShowActivityPopup(false)}
                >
                  <CloseIcon size={30} color="#969C9D" />
                </CloseButton>
              </Tooltip>
              {choice === "Decline" && (
                <StyledInputGroup>
                  <Markup content={contentTop} />
                  <StyledTextArea
                    value={message}
                    required
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  />

                  <Markup content={contentBot} />
                </StyledInputGroup>
              )}
              <ButtonContainer decline={choice === "Decline" ? true : false}>
                <StyledButton
                  onClick={() => {
                    if (type === "Flashcard") {
                      if (choice === "Accept") {
                        archiveFlashcardMutation
                          .mutateAsync({
                            teamId: teamId,
                            flashcardSetId: flashcardSetId,
                            data: { status: "Approved",isActingSuperAdmin: localStorage.getItem('isSuperAdminView') === 'true' ? true:false },
                          })
                          .then(() => setShowActivityPopup(false));
                      } else if (choice === "Decline") {
                        archiveFlashcardMutation
                          .mutateAsync({
                            teamId: teamId,
                            flashcardSetId: flashcardSetId,
                            data: {
                              status: "Decline",
                              inviteText: (
                                contentTop +
                                message +
                                contentBot
                              ).replaceAll("\n", "<br />"),
                              isActingSuperAdmin: localStorage.getItem('isSuperAdminView') === 'true' ? true:false
                            },
                          })
                          .then(() => setShowActivityPopup(false));
                      }
                    } else if (type === "Question" || type === "Answer") {
                      if (choice === "Decline") {
                        questionMergeApprovalMutation
                          .mutateAsync({
                            data: {
                              inviteText: (
                                contentTop +
                                message +
                                contentBot
                              ).replaceAll("\n", "<br />"),
                              status: "Decline",
                              isActingSuperAdmin: localStorage.getItem('isSuperAdminView') === 'true' ? true:false
                            },
                          })
                          .then(() => {
                            refetchActivitesNotifications &&
                              setTimeout(() => {
                                refetchActivitesNotifications();
                              }, 3000);
                          })
                          .then(() => setShowActivityPopup(false));
                      } else if (choice === "Accept") {
                        questionMergeApprovalMutation
                          .mutateAsync({
                            data: { inviteText: "", status: "Merged" },
                          })
                          .then(() => setShowMergeSuccessPopup(true));
                      }
                    }
                  }}
                  decline={choice === "Decline" ? true : false}
                  disabled={
                    type === "Flashcard"
                      ? archiveFlashcardMutation.isLoading
                      : questionMergeApprovalMutation.isLoading
                  }
                >
                  {type === "Flashcard" ? (
                    archiveFlashcardMutation.isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-1"
                        />
                        Sending...
                      </>
                    ) : (
                      <>{choice === "Decline" ? "Decline & Send" : "Accept"}</>
                    )
                  ) : questionMergeApprovalMutation.isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-1"
                      />
                      Sending...
                    </>
                  ) : (
                    <>{choice === "Decline" ? "Decline & Send" : "Accept"}</>
                  )}
                </StyledButton>
              </ButtonContainer>
            </Card>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
}
const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: row;
  justify-content: ${(props) => (props.decline ? "flex-end" : "center")};
`;

const StyledButton = styled(Button)`
  &&& {
    float: ${(props) => (props.decline ? "right" : "left")};
    margin-top: ${(props) => (props.decline ? "1rem" : "")};
  }
`;

const Header = styled.div`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
  display: flex;
  align-items: flex-start;
  text-align: center;
  flex-direction: column;
  color: #003647;

  h1 {
    font-weight: 600;
    font-size: 28px;
  }

  h2 {
    margin-bottom: 0;
  }

  p {
    font-family: Manrope;
    font-weight: 400;
    font-size: 1rem;
  }
`;

const Modal = styled(BSModal)`
  &&& {
    background: #fffffff0;
    z-index: 2000;
    .modal-content {
      background: none;
      border: none;
      display: flex;
      justify-content: center;
    }

    a[href="__INVITE_LINK__"] {
      pointer-events: none;
    }
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  position: absolute;
  right: 4px;
  top: 6px;
`;
const Card = styled.div`
  min-height: ${(props) => (props.choice === "Accept" ? "200px" : "356")};
  max-width: 700px;
  margin: auto;
  background: #ffffff;
  border: 1px solid #81c2c0;
  box-sizing: border-box;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  padding: 1.2rem;
  overflow: auto;
  position: relative;
  max-height: fit-content;
`;

const StyledInputGroup = styled(InputGroup)`
  &&& {
    width: 100%;
    background: rgba(150, 156, 157, 0.05);
    border-radius: 5px;
    display: flex;
    align-items: center;
    padding: 0.5rem;
    margin: 0px !important;
    overflow: auto;
    max-height: 400px;

    .input-group-text {
      height: 34px;
      width: 34px;
      background: #81c2c0;
      border: none;
      border-radius: 50% !important;
      padding: 0.375rem 0.45rem;
      margin-right: 0.5rem;
    }

    input,
    textarea {
      background: transparent;
      border: none;
      font-family: Manrope;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 19px;
      letter-spacing: 0.02em;
      color: #393d3e;

      &:focus {
        outline: none;
        border-color: none;
        box-shadow: none;
        background: transparent;
      }
    }

    textarea {
      height: 100px;
      resize: none;
      width: 100%;
    }
  }
`;

const StyledTextArea = styled.textarea`
  &&& {
    font-family: "Manrope";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.02em;

    color: #393d3e;
  }
`;

const StyledText = styled.div`
  &&& {
    font-family: "Manrope";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    margin-bottom: 10px;
    margin-top: 10px;
    text-align: left;
  }
`;
