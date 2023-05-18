import React, { useState } from "react";
import styled from "styled-components";
import { Modal as BSModal, Image, Row, Col } from "react-bootstrap";
import { IoIosCloseCircleOutline as CloseIcon } from "react-icons/io";
import Labels from "@ui-library/Labels";
import Author from "@ui-library/Author";
import questionService from "@services/question.service";
import { useQuery } from "react-query";
import moment from "moment";
import Bus from "@utils/Bus";
import AnswerViewer from "@ui-library/AnswerViewer";
import FlagIcon from "@public/icons/flag";

export default function MergedHistoryPopup({
  show,
  setShow,
  teamId,
  mergeId,
  mergeType,
}) {
  const [questionCount, setQuestionCount] = useState(0);
  const [answerCount, setAnswerCount] = useState(0);
  const { data: previewData, isLoading } = useQuery(
    ["merge-preview-data", { teamId: teamId, mergeId: mergeId }],
    () =>
      questionService.mergePreview({
        teamId: teamId,
        mergeId: mergeId,
        params: { type: "History" },
      }),
    {
      enabled: !!mergeId && show === true,
      onSuccess: (res) => {
        mergeType === "Question" &&
          setQuestionCount(res.data.childQuestions.length + 1);
        mergeType === "Answer" && setAnswerCount(res.data.answers.length);
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );
  const truncate = (str) => {
    const actualChar = str?.length + str.split(" ").length - 1;
    return actualChar > 30 ? `${str?.substring(0, 27)}...` : str;
  };

  return (
    <Modal
      className="bs"
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <CardView>
        <StyledCardHeader className="card-header">
          {isLoading ? (
            <Header>Loading </Header>
          ) : (
            <>
              <CloseButton
                type="button"
                onClick={() => {
                  setShow(false);
                }}
              >
                <CloseIcon size={30} color="#969C9D" />
              </CloseButton>
              {mergeType === "Question" && (
                <Header>Merged Questions ({questionCount})</Header>
              )}

              {mergeType === "Answer" && (
                <Header>Merged Answers ({answerCount})</Header>
              )}

              <RequestedUserListContainer>
                {previewData?.data?.requestedBy.map((user, index) => (
                  <RequestedUserCard key={index}>
                    <div className="user-header">Requested By</div>
                    <div className="details-user-container">
                      <ProfilePicture
                        src={user.avtar_url || "/images/team-placeholder.png"}
                        roundedCircle
                        alt="profile"
                        referrerPolicy="no-referrer"
                      />
                      <div className="details-user">
                        <div className="user-name">
                          {truncate(String(user.requestedName))}
                        </div>
                        <div>
                          {user.created_at
                            ? moment(user.created_at).format("MMM DD, h:mmA")
                            : ""}
                        </div>
                      </div>
                    </div>
                  </RequestedUserCard>
                ))}
              </RequestedUserListContainer>
            </>
          )}
        </StyledCardHeader>
        {isLoading ? (
          <></>
        ) : (
          <>
            {mergeType === "Question" && (
              <>
                <div className="parentCard">
                  <CardMain>
                    <div className="meta2">
                      <p className="questionContent">
                        <b>
                          {previewData?.data?.primaryQuestion?.questionText}
                        </b>
                      </p>
                      <Author
                        author={{
                          name: previewData?.data?.primaryQuestion
                            ?.questionAuthor,
                          picture: previewData?.data?.primaryQuestion?.avtarUrl,
                          title:
                            previewData?.data?.primaryQuestion
                              ?.questionAuthorTitle,
                          department:
                            previewData?.data?.primaryQuestion
                              ?.questionAuthorDepartment,
                        }}
                        createdAt={
                          previewData?.data?.primaryQuestion?.createdAt
                        }
                      />
                      <BlankDiv />
                      <Labels
                        labels={
                          previewData?.data?.primaryQuestion?.questionLabels
                        }
                        questionId={
                          previewData?.data?.primaryQuestion?.questionId
                        }
                        showAddLabel={false}
                      />
                    </div>
                  </CardMain>
                </div>
                <div className="questions">
                  {previewData?.data?.childQuestions?.map((question, index) => (
                    <CardMain key={index}>
                      <div className="meta2">
                        <p className="questionContent">
                          {question?.questionText}
                        </p>
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
                            labels={answer?.labels}
                            answerId={answer?.id}
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
            )}
          </>
        )}
      </CardView>
    </Modal>
  );
}

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

const RequestedUserListContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
`;

const RequestedUserCard = styled.div`
  &&& {
    padding: 10px 0px 10px 0px;
    width: 200px;
    .user-header {
      font-family: "Barlow Condensed";
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 24px;
      color: #1f5462;
      padding: 10px 0px 10px;
    }
    .details-user-container {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;

      .details-user {
        flex-basis: 70%;
        .user-name {
          font-family: "Manrope";
          font-style: normal;
          font-weight: 700;
          font-size: 16px;
          line-height: 19px;
          color: #393d3e;
          width: 100%;
        }
        .timestamp {
          font-family: "Manrope";
          font-style: normal;
          font-weight: 400;
          font-size: 16px;
          line-height: 19px;
          color: #393d3e;
          width: 100%;
        }
      }
    }
  }
`;

const StyledCardHeader = styled.div`
  //   padding-bottom: 15px !important;
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

const Views = styled.span`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 17px;
  text-align: right;
  color: #81c2c0;
`;
