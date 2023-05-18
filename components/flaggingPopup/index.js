import React, { useState } from "react";
import styled from "styled-components";
import {
  Card as BsCard,
  ToggleButtonGroup,
  Button as BsButton,
  Modal,
  Spinner,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import answerService from "@services/answer.service";
import { useMutation } from "react-query";
import { useTeam } from "@contexts/TeamContext";
import flashcardService from "@services/flashcard.service";
import Checkbox from "@ui-library/Checkbox";
import { useRouter } from "next/router";
import Bus from "@utils/Bus";

export default function FlaggingPopup({
  show = true,
  handleClose,
  answerId,
  flashId,
  createdById,
  refetchFlashcard,
  questionId,
  isMergeRequested,
  questionNumber,
  isFlagged,
  onMutate = () => {}, // a function execute on mutate for useMutation hook.
}) {
  const { team } = useTeam();
  const router = useRouter();
  const [reason, setReason] = useState(null);
  const [checkedState, setCheckedState] = useState({
    inaccurate: false,
    outOfDate: false,
    merge: false,
  });

  const mutation = useMutation(
    ({ teamId, answerId, data }) =>
      answerService.reaction(teamId, answerId, data),
    {
      onSuccess: () => {
        handleClose();
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
      onMutate,
      onSettled: () => {
        // queryClient.invalidateQueries(['all-answers', { teamId: team?.id }])
      },
    }
  );

  const Flashcardmutation = useMutation(
    ({ teamId, flashId, data }) =>
      flashcardService.addReaction(teamId, flashId, data),
    {
      onSuccess: () => {
        handleClose();
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
      onSettled: () => {
        refetchFlashcard && refetchFlashcard();
      },
    }
  );

  const onSubmit = () => {
    if (answerId) {
      if ((checkedState.inaccurate || checkedState.outOfDate) === true) {
        mutation.mutate({
          teamId: team.id,
          answerId,
          data: { reaction: 3, reason },
        });
      } else {
        router.push(
          `/answer-merge/${questionId}?qN=${questionNumber}&a=${answerId}`
        );
      }
    } else {
      Flashcardmutation.mutate({
        teamId: team.id,
        flashId,
        data: { reaction: 3, reason, userId: createdById },
      });
    }
  };

  const handleChange = (e) => {
    switch (e.target.name.toString()) {
      case "inaccurate":
        setCheckedState({ inaccurate: true, outOfDate: false, merge: false });
        setReason("inaccurate");
        break;
      case "outOfDate":
        setCheckedState({ inaccurate: false, outOfDate: true, merge: false });
        setReason("out of date");
        break;
      case "merge":
        setCheckedState({ inaccurate: false, outOfDate: false, merge: true });
        break;
    }
  };

  return (
    <Modal className="bs" centered show={show} onHide={handleClose}>
      <Modal.Body className="p-0">
        <Card>
          <Card.Body>
            <CloseButton onClick={handleClose}>
              <CloseIcon size={24} color="#969C9D" />
            </CloseButton>
            <Card.Title>
              Why are you flagging this {answerId ? "answer" : "set"}?
            </Card.Title>
            <Card.Text>
              Select the primary reason for flagging this{" "}
              {answerId ? "answer" : "set"}
            </Card.Text>
            <StyledContainer className="container overflow-hidden">
              <Row className="mb-4">
                <Col className="col-1">
                  <Checkbox
                    id={`checkbox-inaccurate`}
                    name={`inaccurate`}
                    checked={checkedState.inaccurate}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    disabled={isFlagged}
                  />
                </Col>
                <StyledCol className="col-11" checked={checkedState.inaccurate}>
                  Inaccurate {answerId ? "Answer" : "Set"}
                </StyledCol>
              </Row>

              <Row className="mb-4">
                <Col className="col-1">
                  <Checkbox
                    id={`checkbox-outofdate`}
                    name={`outOfDate`}
                    checked={checkedState.outOfDate}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    disabled={isFlagged}
                  />
                </Col>
                <StyledCol className="col-11" checked={checkedState.outOfDate}>
                  Out Of Date {answerId ? "Answer" : "Set"}
                </StyledCol>
              </Row>

              {answerId && (
                <Row className="mb-4">
                  <Col className="col-1">
                    <Checkbox
                      id={`checkbox-merge`}
                      name={`merge`}
                      checked={checkedState.merge}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      disabled={isMergeRequested}
                    />
                  </Col>
                  <StyledCol className="col-11" checked={checkedState.merge}>
                    Merge With Duplicates
                  </StyledCol>
                </Row>
              )}
            </StyledContainer>

            <StyledHr />
          </Card.Body>
          <Card.Footer>
            {answerId ? (
              <Button
                variant="secondary"
                onClick={onSubmit}
                disabled={
                  mutation.isLoading ||
                  (checkedState.merge === false &&
                    checkedState.inaccurate === false &&
                    checkedState.outOfDate === false)
                }
              >
                {mutation.isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-1"
                    />
                    Please Wait...
                  </>
                ) : (
                  <>
                    {checkedState.merge
                      ? "Merge Answers"
                      : checkedState.inaccurate || checkedState.outOfDate
                      ? "Notify Admin"
                      : "Choose an option"}
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={onSubmit}
                disabled={
                  Flashcardmutation.isLoading ||
                  (checkedState.inaccurate === false &&
                    checkedState.outOfDate === false)
                }
              >
                {Flashcardmutation.isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-1"
                    />
                    Please Wait...
                  </>
                ) : (
                  <>
                    {checkedState.inaccurate || checkedState.outOfDate
                      ? "Notify Admin"
                      : "Choose an option"}
                  </>
                )}
              </Button>
            )}
          </Card.Footer>
        </Card>
      </Modal.Body>
    </Modal>
  );
}
const StyledHr = styled.hr`
  &&& {
    margin: 0 -2rem;
    opcaity: 0;
    background-color: #c4c4c4;
  }
`;
const StyledContainer = styled(Container)`
  padding-left: 0px !important;
  padding-top: 20px;
`;

const StyledCol = styled(Col)`
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.02em;
  color: ${(props) => (props.checked === true ? "#1F5462" : "#888b8b")};
`;
const Card = styled(BsCard)`
  &&& {
    background: #ffffff;
    box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 1rem;
    .card-body {
      display: flex;
      flex-direction: column;
      align-items: left;
      .card-title {
        font-family: Barlow Condensed;
        font-style: normal;
        font-weight: 500;
        font-size: 25px;
        line-height: 30px;
        text-align: left;
        color: #003647;
      }
      .card-text {
        font-family: Manrope;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 19px;
        text-align: left;
        color: #393d3e;
        margin-bottom: 0.5rem;
      }
    }
    .card-footer {
      border: none;
      background-color: #ffffff;
      display: flex;
      justify-content: end;
    }
  }
`;

const LabelContainer = styled(ToggleButtonGroup)`
  &&& {
    /* display: inline-block; */
    margin-bottom: 1rem;
    .btn {
      border-radius: 5px !important;
      margin: 0.3rem 0.5rem;
      font-family: Barlow Condensed;
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 24px;
      text-align: center;
      letter-spacing: 0.02em;
    }
  }
`;

const Button = styled(BsButton)`
  &&& {
    font-family: Barlow Condensed;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: #ffffff;
    padding: 0.5rem 1.5rem;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  position: absolute;
  right: 2px;
  top: 2px;
`;
