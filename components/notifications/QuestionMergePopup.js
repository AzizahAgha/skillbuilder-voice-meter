import React, { useState } from "react";
import styled from "styled-components";
import { Modal as BSModal, InputGroup, Image, Row, Col } from "react-bootstrap";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import { Markup } from "interweave";
import Labels from "@ui-library/Labels";
import Author from "@ui-library/Author";
import questionService from "@services/question.service";
import { useQuery } from "react-query";
import Button from "@ui-library/Button";
import AnswerViewer from "@ui-library/AnswerViewer";
import Bus from "@utils/Bus";
import FlagIcon from "@public/icons/flag";

export default function QuestionMergePopup({
  showQMergePopup,
  setShowQMergePopup,
  image,
  requestedName,
  questionId,
  userName,
  teamId,
  setShowActivityPopup,
  setChoice,
  questionMergeApprovalMutation,
  mergeId,
  mergeType,
  setShowMergeSuccessPopup,
}) {
  const { data: previewData } = useQuery(
    ["merge-preview-data", { teamId: teamId, mergeId: mergeId }],
    () =>
      questionService.mergePreview({
        teamId: teamId,
        mergeId: mergeId,
        params: { type: "Preview" },
      }),
    {
      enabled: !!mergeId && showQMergePopup === true,

      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );
  return (
    <Modal
      className="bs"
      show={showQMergePopup}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <CardView>
        <StyledCardHeader className="card-header">
          <CloseButton
            type="button"
            onClick={() => {
              setShowQMergePopup(false);
            }}
          >
            <CloseIcon size={30} color="#969C9D" />
          </CloseButton>

          {mergeType === "Question" && (
            <>
              <Header>Request : Merge Questions</Header>
              <StyledText>
                <ProfilePicture
                  src={image || "/images/team-placeholder.png"}
                  roundedCircle
                  alt="profile"
                  referrerPolicy="no-referrer"
                />
                <b>{requestedName}</b> has requested the following question
                merge
              </StyledText>
            </>
          )}

          {mergeType === "Answer" && (
            <>
              <Header>Request : Merge Answers</Header>
              <StyledText>
                <ProfilePicture
                  src={image || "/images/team-placeholder.png"}
                  roundedCircle
                  alt="profile"
                  referrerPolicy="no-referrer"
                />
                <b>{previewData?.data?.requestedBy?.requestedName}</b> has
                requested the following answer merge
              </StyledText>
            </>
          )}
        </StyledCardHeader>

        {mergeType === "Question" && (
          <div className="card-content">
            <StyledCardHeader className="card-header">
              <HeaderMessage className="my-2">
                Message from {requestedName}
              </HeaderMessage>
              <StyledInput>
                <Markup content={previewData?.data.message} />
              </StyledInput>
              <HeaderMessage className="mt-4 mb-2">
                Questions to Merge
              </HeaderMessage>
            </StyledCardHeader>
          </div>
        )}

        {mergeType === "Answer" && (
          <div className="card-content">
            <StyledCardHeader className="card-header">
              <HeaderMessage className="my-2">
                Message from {previewData?.data?.requestedBy?.requestedName}
              </HeaderMessage>
              <StyledInput>
                <Markup content={previewData?.data.message} />
              </StyledInput>
              <HeaderMessage className="mt-4 mb-2">
                Answers to Merge
              </HeaderMessage>
            </StyledCardHeader>
          </div>
        )}

        {mergeType === "Question" && (
          <>
            <div className="parentCard">
              <CardMain>
                <div className="meta2">
                  <p className="questionContent">
                    <b>{previewData?.data?.primaryQuestion?.questionText}</b>
                  </p>
                  <Author
                    author={{
                      name: previewData?.data?.primaryQuestion?.questionAuthor,
                      picture: previewData?.data?.primaryQuestion?.avtarUrl,
                      title:
                        previewData?.data?.primaryQuestion?.questionAuthorTitle,
                      department:
                        previewData?.data?.primaryQuestion
                          ?.questionAuthorDepartment,
                    }}
                    createdAt={previewData?.data?.primaryQuestion?.createdAt}
                  />
                  <BlankDiv />
                  <Labels
                    labels={previewData?.data?.primaryQuestion?.questionLabels}
                    questionId={previewData?.data?.primaryQuestion?.questionId}
                    showAddLabel={false}
                  />
                </div>
              </CardMain>
            </div>
            <div className="questions">
              {previewData?.data?.childQuestions?.map((question, index) => (
                <CardMain key={index}>
                  <div className="meta2">
                    <p className="questionContent">{question?.questionText}</p>
                    <Author
                      author={{
                        name: question?.questionAuthor,
                        picture: question?.avtarUrl,
                        title: question?.questionAuthorTitle,
                        department: question?.questionAuthorDepartment,
                      }}
                      createdAt={question?.createdAt}
                    />
                    <BlankDiv />
                    <Labels
                      labels={question?.questionLabels}
                      questionId={question?.questionId}
                      showAddLabel={false}
                    />
                  </div>
                </CardMain>
              ))}
            </div>
          </>
        )}

        {mergeType === "Answer" && (
          <>
            <div className="questions">
              {previewData?.data?.answers?.map((answer, index) => (
                <CardMain key={index}>
                  <div className="meta2">
                    <p className="questionContent">
                      <AnswerViewer content={answer?.answerText} />
                    </p>
                    <Row>
                      {answer?.authorsUsers &&
                        answer.authorsUsers.map((author, idx) => (
                          <Col key={idx}>
                            <Author
                              author={{
                                name: author?.authorName,
                                picture: author?.avtarUrl,
                                title: author?.title,
                                department: author?.departmentName,
                              }}
                              createdAt={answer?.answerCreatedAt}
                            />
                          </Col>
                        ))}
                    </Row>

                    <BlankDiv />
                    <Row className="mt-1">
                      <Col className="col-8">
                        <Labels
                          labels={answer?.answerLabels}
                          answerId={answer?.questionId}
                          showAddLabel={false}
                        />
                      </Col>
                      <Col className="col-4">
                        <span className="mx-1">&#128077;</span>
                        <Count>{answer?.reactionCount?.upVote}</Count>
                        <span className="mx-1">&#128078;</span>
                        <Count>{answer?.reactionCount?.downVote}</Count>
                        <span className="mx-1">
                          <FlagIcon height={20} />
                        </span>
                        <Count>{answer?.flags}</Count>
                        <Views>
                          <Count view>{answer?.answerViews}</Count>Views
                        </Views>
                      </Col>
                    </Row>
                  </div>
                </CardMain>
              ))}
            </div>
          </>
        )}

        <div className="card-footer">
          <ButtonContainer>
            <StyledButton
              color="#81C2C0"
              text="#fff"
              onClick={() => {
                setShowActivityPopup(true);
                setChoice("Decline");
                setShowQMergePopup(false);
              }}
            >
              Decline
            </StyledButton>
            <StyledButton
              color="#FF804A"
              text="#fff"
              onClick={() => {
                questionMergeApprovalMutation
                  .mutateAsync({
                    data: { inviteText: "", status: "Merged" },
                  })
                  .then(() => setShowMergeSuccessPopup(true));
              }}
            >
              Merge
            </StyledButton>
          </ButtonContainer>
        </div>
      </CardView>
    </Modal>
  );
}

const StyledCardHeader = styled.div`
  padding-bottom: 5px !important;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
`;

const StyledButton = styled(Button)`
  &&& {
    border: 1px solid #969c9d;
    border-radius: 5px;
    color: ${(props) => (props.text ? props.text : "#969c9d")};
    margin: 10px 10px 10px 0px;
    width: 60px;
    text-align: center;
    font-family: "Barlow Condensed";
    font-style: normal;
    font-weight: 500;
    font-size: 20x;
    line-height: 20px;
    background: ${(props) => (props.color ? props.color : "")};
  }
`;

const CardView = styled.div`
  background: #fff;
  margin: 20px 0 50px;
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.1);
  .card-header {
    padding: 25px 35px;
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }
  .card-footer {
    padding: 25px 35px;
    background-color: #fff;
    border-top: 1px solid #c4c4c4;
    margin-top: 0;
  }
  .parentCard {
    background-color: #f5f5f5;
    padding: 25px 35px;
    > div {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }
  .questions {
    padding: 25px 35px;
  }
`;

const CardMain = styled.div`
  position: relative;
  border-bottom: 1px solid #969c9d;
  padding-bottom: 15px;
  margin-bottom: 15px;
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }

  .meta2 {
    .questionContent {
      font-family: "Manrope", sans-serif;
      font-size: 16px;
      word-wrap: break-word;
      .fpHuow {
        min-height: 0px !important;
      }
    }
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
  top: 30px;
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

const HeaderMessage = styled.div`
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  text-align: left;
  color: #1f5462;
`;

const StyledInput = styled(InputGroup)`
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
      height: 50px;
      resize: none;
      width: 100%;
    }
  }
`;

const BlankDiv = styled.div`
  height: 10px;
`;

const ProfilePicture = styled(Image)`
  &&& {
    width: 38px;
    height: 38px;
    margin-right: 10px;
  }
`;

const Count = styled.span`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 17px;
  color: ${(props) => (props.view ? "#81c2c0" : "#cecece")};
  margin-left: 5px;
  margin-right: 5px;
`;

const Views = styled.span`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 17px;
  text-align: right;
  color: #81c2c0;
`;
