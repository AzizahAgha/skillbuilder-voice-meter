import React, { useState, useRef } from "react";
import Priority, { BadgeType } from "./Priority";
import styled from "styled-components";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import AddAnswerPopup from "@components/dataTables/AddAnswerPopup";
import AnswerViewer from "./AnswerViewer";
import Labels from "./Labels";
// import Highlighter from "react-highlight-words";
import { Markup } from "interweave";
import striptags from "striptags";
import { convert } from "html-to-text";
import { getConfidenceLabel, getDifferentiationLabel } from "@utils/helpers";
import { Button as BsButton, Row as BsRow, Col } from "react-bootstrap";
import { useMutation, useQueryClient } from "react-query";
import { useTeam } from "@contexts/TeamContext";
import answerService from "@services/answer.service";
import { useAuthUser } from "@contexts/AuthContext";
import transformAnswerForSaving from "@transformers/answerForSaving.transformer";
import Author from "@ui-library/Author";
import EmojiPalette from "./EmojiPalette";
import AttachmentList from "@components/mediarecorder/AttachmentList";
import { FiCopy } from "react-icons/fi";
import MergedHistoryPopup from "@components/questionMerge/MergedHistoryPopup";
import HtmlHighlighter from "./HtmlHighlighter";
import ArrowImg from "@public/images/pngwing.com.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  min-width: 230px;
  height: 100%;
`;

const Text = styled.div`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: #393d3e;
  margin-top: 10px;
  cursor: ${(props) => (props.mousePointer === true ? "pointer" : "default")};
  min-height: 100px;
  .highlight {
    background-color: #fde87b !important;
  }
`;

const Tag = styled.div`
  margin-right: 20px;
  color: #1f5462;
  font-size: 0.9rem;
  white-space: nowrap;
  @media (max-width: 768px) {
    //margin-left: 0;
  }
  & span {
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;

    & strong {
      font-weight: bold;
    }
  }
`;

const Counter = styled.span`
  font-family: Barlow Condensed, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  text-align: center;
  display: flex;
  flex-direction: row;
  color: #393d3e88;
  user-select: none;
  min-width: 60px;

  span {
    white-space: nowrap;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const Answer = ({
  answer,
  showFactors = true,
  question,
  onAdd,
  showNavigator = true,
  showAddButton = true,
  counter,
  onNext,
  onPrev,
  totalCount, // total number of answers for a question.
  searchKeyword,
  enableActions = false, // options include Agree, Disagree & Flag.
  filters,
  isTimelineView = false,
  isDetailView = false,
  flipcardView = false,
  refetchCardView,
  refetchSummaryView,
  refetchPopup,
  refetchData,
  disableAnswerOptions,
}) => {
  const mergeId = answer?.mergeId;
  const [showFlaggingPopup, setShowFlaggingPopup] = useState(false);
  const queryClient = useQueryClient();
  const { team } = useTeam();
  const { auth } = useAuthUser();
  const editBtnRef = useRef();
  const [showReaction, setshowReaction] = useState(false);
  const toggleShowReaction = () => setshowReaction(!showReaction);
  const [answerAttachment, setanswerAttachment] = useState([]);
  const [showMergedHistoryPopup, setShowMergedHistoryPopup] = useState(false);

  const showAddLabel = !flipcardView;

  const reactionRemoveMutation = useMutation(
    ({ teamId, answerId }) => answerService.reactionRemove(teamId, answerId),
    {
      onSuccess: () => {
        refetchPopup && refetchPopup();
        refetchCardView && refetchCardView();
        refetchSummaryView && refetchSummaryView();
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );
  const reactionMutation = useMutation(
    ({ teamId, answerId, data }) =>
      answerService.reaction(teamId, answerId, data),
    {
      onSuccess: () => {
        refetchPopup && refetchPopup();
        refetchCardView && refetchCardView();
        refetchSummaryView && refetchSummaryView();
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const answerMutation = useMutation(
    ({ teamId, answerId, data }) =>
      answerService.update(teamId, answerId, data),
    {
      onMutate: ({ data, answerId }) => {
        queryClient.setQueryData(
          ["all-answers", { teamId: team?.id, questionId: question?.id }],
          (old) => {
            // console.log(old);
            answer.text = data.answerText;
            answer.differentiation = data.differentiation;
            answer.confidence = data.confidence;
            answer.risk = data.risk;
            answer.attachment = data.attachment;
            return {
              ...old,
              data: old?.data?.map((_ans) =>
                answer.id === _ans.id
                  ? {
                      ..._ans,
                      ...data,
                      text: data.answerText,
                    }
                  : answer
              ),
            };
          }
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries([
          "answers",
          {
            teamId: team?.id,
            questionId: question.id,
            filters,
            answerType: "details",
            searchString: searchKeyword,
          },
        ]);
        queryClient.invalidateQueries([
          "all-answers",
          { teamId: team?.id, questionId: question?.id },
        ]);
      },
      onSuccess: () => {
        refetchData && refetchData();
      },
    }
  );

  const sendReaction = (number) => {
    reactionMutation.mutate({
      teamId: team.id,
      answerId: answer.id,
      data: { reaction: number },
    });
    setshowReaction(false);
  };

  const removeCurrentReaction = () => {
    reactionRemoveMutation.mutate({
      teamId: team.id,
      answerId: answer.id,
    });
    showReaction && setshowReaction(false);
  };

  const EditButton = () => (
    <BsButton className="d-none" ref={editBtnRef}></BsButton>
  );

  return (
    <Container>
      <Row>
        <div
          className={`answerComponent d-flex align-items-center justify-content-${
            answer ? "between" : "end"
          } w-100`}
        >
          {answer ? (
            isDetailView ? (
              <Priority
                type={BadgeType.Answer}
                differentiation={question?.differentiation}
                confidence={question?.confidence}
                filled={true}
                showShowFullLabel={true}
                showInfoPopUp={true}
              />
            ) : (
              <Priority
                type={BadgeType.Answer}
                differentiation={answer?.differentiation}
                confidence={answer?.confidence}
                filled={true}
                showShowFullLabel={true}
                showInfoPopUp={true}
              />
            )
          ) : (
            ""
          )}

          {answer && showFactors && (
            <React.Fragment>
              <Tag>
                <strong>Confidence:</strong>{" "}
                {getConfidenceLabel(answer?.confidence).split(" ")[0]}
              </Tag>
              <Tag>
                <strong>Differentiation:</strong>{" "}
                {getDifferentiationLabel(answer?.differentiation).split(" ")[0]}
              </Tag>
            </React.Fragment>
          )}

          {showAddLabel && <div className="flex-grow-1" />}
          <div className="d-flex align-items-center">
            {answer && (
              <>
                <MergedHistoryPopup
                  show={showMergedHistoryPopup}
                  setShow={setShowMergedHistoryPopup}
                  teamId={team?.id}
                  mergeId={mergeId}
                  mergeType="Answer"
                />
                <Counter>
                  {mergeId && (
                    <div
                      className="mx-1"
                      onClick={() => {
                        setShowMergedHistoryPopup(true);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <FiCopy color="#969C9D" size={15} />
                      <span> Merged</span>
                    </div>
                  )}
                  {showNavigator && (
                    <>
                      <MdKeyboardArrowLeft
                        color="#393D3E88"
                        size={16}
                        role="button"
                        onClick={onPrev}
                      />
                      <span>
                        {counter} of {totalCount}
                      </span>
                      <MdKeyboardArrowRight
                        color="#393D3E88"
                        size={16}
                        role="button"
                        onClick={onNext}
                      />
                    </>
                  )}
                </Counter>
              </>
            )}
            {!disableAnswerOptions && showAddButton && (
              <AddAnswerPopup
                question={question}
                handleSubmit={onAdd}
                refetchSummaryView={refetchSummaryView}
              />
            )}
          </div>
        </div>

        {!answer && !disableAnswerOptions && (
          <EmptyAnswer>
            <span>Add a new answer</span>
            <img
              style={{
                height: "auto",
                width: "100%",
                maxWidth: "70px",
              }}
              alt="arrow-image"
              src={ArrowImg.src}
            ></img>
          </EmptyAnswer>
        )}

        {/* popup to edit answer */}
        {!disableAnswerOptions && (
          <AddAnswerPopup
            question={question}
            handleSubmit={async (values) => {
              await answerMutation.mutateAsync({
                teamId: team.id,
                answerId: answer.id,
                data: transformAnswerForSaving(values),
              });
            }}
            answer={answer}
            showAllAnswersPreviewOption={false}
            CustomButton={EditButton}
            isEditable
            isDetailView={isDetailView}
          />
        )}

        <Text
          disabled={disableAnswerOptions ? true : false}
          onClick={() => {
            if (!disableAnswerOptions) {
              if (answer?.authorsUsers) {
                answer?.authorsUsers
                  .map((author) => author.authorId)
                  .includes(auth.user.id) && editBtnRef.current.click();
              } else {
                answer?.author.id === auth.user.id &&
                  editBtnRef.current.click();
              }
            }
          }}
          mousePointer={
            answer === undefined || disableAnswerOptions ? false : true
          }
        >
          {answer?.text ? (
            searchKeyword ? (
              <>
                {/* <Highlighter
                  highlightClassName="highlight"
                  searchWords={[searchKeyword]}
                  autoEscape={true}
                  textToHighlight={answer?.text}
                /> */}
                <HtmlHighlighter
                  answerHtml={answer?.text}
                  searchKeyword={searchKeyword}
                />
              </>
            ) : (
              <AnswerViewer content={answer?.text} />
            )
          ) : (
            <div>
              {flipcardView
                ? "There are no answers for this question, please add you answer."
                : ""}
            </div>
          )}
        </Text>
        {answer && (
          <div>
            <AttachmentList
              attachments={answer?.attachment}
              setAttachments={setanswerAttachment}
              tableView={isDetailView ? true : false}
            />
          </div>
        )}
      </Row>

      <Row>
        {mergeId && enableActions && <StyledHr />}

        {enableActions ? (
          <BsRow>
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
          </BsRow>
        ) : (
          answer?.author && (
            <Author author={answer?.author} createdAt={answer?.createdAt} />
          )
        )}

        <Blankdiv />
        <FlexWrapper>
          <FlexItemLabel isTimelineView>
            {answer && (
              <Labels
                labels={answer?.labels}
                questionId={question?.id}
                answerId={answer?.id}
                filters={filters}
                searchKeyword={searchKeyword}
                showAddLabel={showAddLabel}
                refetchSummaryView={refetchSummaryView}
              />
            )}
          </FlexItemLabel>
          {answer && (
            <EmojiPalette
              data={answer}
              removeCurrentReaction={removeCurrentReaction}
              sendReaction={sendReaction}
              showReaction={showReaction}
              setshowReaction={setshowReaction}
              toggleShowReaction={toggleShowReaction}
              enableActions={enableActions}
              showFlaggingPopup={showFlaggingPopup}
              setShowFlaggingPopup={setShowFlaggingPopup}
              showAddEmoji={showAddLabel}
              questionId={question?.id}
              questionNumber={question?.number}
            />
          )}
        </FlexWrapper>
      </Row>
    </Container>
  );
};

export default Answer;

const StyledHr = styled.hr`
  color: #969c9d !important;
  width: 100%;
`;

const EmptyAnswer = styled.div`
  position: absolute;
  right: 22px;
  span {
    font-family: Manrope;
    font-size: 14px;
    position: absolute;
    bottom: -10px;
    left: -60px;
    color: #737b7d;
  }
  img {
    opacity: 0.4;
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  // @media (max-width: 770px) {
  flex-wrap: wrap;
  // }
`;

const FlexItemLabel = styled.div`
  &&& {
    display: flex;
    flex-basis: ${(props) => (props.isTimelineView ? "40%" : "60%")};
    flex-grow: 1;
    flex-shrink: 1;
    @media (max-width: 425px) {
      // flex-basis: 100% !important;
    }
  }
`;

const Blankdiv = styled.div`
  height: 10px;
`;
