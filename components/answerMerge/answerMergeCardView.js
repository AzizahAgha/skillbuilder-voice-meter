import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Labels from "@ui-library/Labels";
import Author from "@ui-library/Author";
import {
  Button as BsButton,
  InputGroup,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { IoSearchOutline } from "react-icons/io5";
import { DebounceInput } from "react-debounce-input";
import FiltersModal from "@components/filters/FiltersModal";
import answerService from "@services/answer.service";
import Checkbox from "@ui-library/Checkbox";
import Tooltip from "@ui-library/Tooltip";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Markup } from "interweave";
import { useQuery, useMutation } from "react-query";
import MergeSuccessPopup from "@ui-library/MergeSuccessPopup";
import { useRouter } from "next/router";
import AnswerViewer from "@ui-library/AnswerViewer";
import questionService from "@services/question.service";
import FlagIcon from "@public/icons/flag";
import Bus from "@utils/Bus";
import { convert } from "html-to-text";
import striptags from "striptags";

export default function AnswerMergeCardView({
  userName,
  adminName,
  questionId,
  teamId,
  type,
  answerId,
}) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [step, setStep] = useState(type === "popup" ? 2 : 1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState(undefined);
  const [results, setResults] = useState(null);
  const [checkedState, setCheckedState] = useState({});
  const [answerList, setAnswerList] = useState([]);
  const [parentAnswer, setParentAnswer] = useState(null);
  const mergeMutation = useMutation(({ data }) =>
    questionService.mergeQuestions({
      data: data,
      teamId: teamId,
      questionId: questionId,
    })
  );
  const { data: allAnswers, refetch: refetchCardView } = useQuery(
    [
      "all-answers",
      {
        teamId: teamId,
        questionId: questionId,
        filters,
        searchString: searchKeyword,
      },
    ],
    () =>
      answerService.getAll({
        params: {
          answerType: "card",
          type: "all",
          searchString: searchKeyword,
        },

        teamId: teamId,
        questionId: questionId,
        filters,
      }),
    {
      enabled: !!questionId && !!teamId,
      onSuccess: (res) => {
        const selected = {};
        res?.data.map((answer) => {
          if (answer.id === answerId) {
            setParentAnswer(answer);
            selected[answer.id] = true;
          } else {
            selected[answer.id] = false;
          }
        });
        setCheckedState(selected);
        setIsLoaded(true);
        setResults(res.count);
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const handleOnChange = (e, answerId) => {
    if (answerList.length >= 4 && e.target.checked) return;
    setCheckedState({
      ...checkedState,
      [answerId]: !checkedState[answerId],
    });
  };

  const moveNextStep = () => {
    setStep(2);
  };

  const sendRequest = () => {
    mergeMutation
      .mutateAsync({
        data: {
          mergeType: "Answer",
          answers: answerList,
          message: (contentTop + message + contentBot).replaceAll(
            "\n",
            "<br />"
          ),
          isActingSuperAdmin:
            localStorage.getItem("isSuperAdminView") === "true" ? true : false,
        },
      })
      .then(setShowMergeSuccessPopup(true));
  };

  const clearSelection = () => {
    const newCheckedState = {};
    for (let key in checkedState) {
      if (key === answerId) {
        newCheckedState[key] = true;
      } else {
        newCheckedState[key] = false;
      }
    }
    setCheckedState(newCheckedState);
  };

  useEffect(() => {
    const newAnswerList = Object.entries(checkedState)
      .filter((e) => e[1] === true)
      .map((e) => e[0]);
    setAnswerList(newAnswerList);
  }, [checkedState]);

  const contentTop = `Hi ${adminName} ,` + "\n" + "\n";
  const contentBot = "\n" + "\n" + `- ${userName}`;
  const [message, setMessage] = useState(
    `I think we can merge these answers - do you agree?`
  );
  const [showMergeSuccessPopup, setShowMergeSuccessPopup] = useState(false);
  return (
    <CardView>
      <div className="card-header">
        <div className="title">Answers: Merge With Duplicates</div>
        <div className="desc">
          <b>Step {step} of 2: </b>
          <span>
            {step === 1
              ? "Select up to 3 answers from below to merge "
              : "Send a message to you Admin with your merge request."}
            {
              <b>
                &quot;
                {striptags(parentAnswer?.answerText)}
                &quot;
              </b>
            }
          </span>
        </div>

        {step === 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
            <div className="d-flex align-items-center">
              <FiltersModal
                hideQuestionFilters={true}
                onFiltersChange={setFilters}
                setResults={setResults}
                question={{ id: questionId }}
                isAnswerMerge={true}
              />

              <StyledInputGroup>
                <InputGroup.Text>
                  <IoSearchOutline color="#003647" size={20} />
                </InputGroup.Text>

                <Input
                  type="search"
                  minLength={1}
                  debounceTimeout={300}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Search"
                  className="form-control"
                />

                {searchKeyword && (
                  <Tooltip text="Clear" placement="right">
                    <ClearButton
                      variant="default"
                      onClick={() => setSearchKeyword("")}
                    >
                      <IoIosCloseCircleOutline color="#969C9D" size={20} />
                    </ClearButton>
                  </Tooltip>
                )}
              </StyledInputGroup>
            </div>

            <div className="filterMeta d-flex justify-content-between align-items-center">
              <span>
                {Math.max(
                  0,
                  results ? results - 1 : allAnswers?.data.length - 1
                )}{" "}
                Results
              </span>
              <span className="mx-2">|</span>
              <span>
                <StyledButton
                  onClick={() => {
                    router.reload();
                  }}
                >
                  Clear Filter
                </StyledButton>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="card-content">
        {step === 2 && (
          <StyledCardHeader className="card-header">
            <Header className="my-2">Message to Admin</Header>
            <StyledInput>
              <Markup content={contentTop} />
              <StyledTextArea
                value={message}
                required
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <Markup content={contentBot} />
            </StyledInput>
            <Header className="mt-4 mb-2">Answers to Merge</Header>
          </StyledCardHeader>
        )}

        {step === 1 && isLoaded && allAnswers?.data.length > 0 && (
          <div className="questions">
            {allAnswers?.data.map(
              (answerMeta, index) =>
                answerMeta?.id !== answerId && (
                  <CardMain key={index}>
                    <div className="meta1 d-flex">
                      <Checkbox
                        id={`custom-checkbox-${answerMeta?.id}`}
                        name={`custom-checkbox-${answerMeta?.id}`}
                        checked={checkedState[answerMeta?.id]}
                        onChange={(e) => handleOnChange(e, answerMeta?.id)}
                      />
                    </div>
                    <div className="meta2">
                      <p className="questionContent">
                        <AnswerSelectionHighlight
                          selected={checkedState[answerMeta?.id]}
                        >
                          <AnswerViewer content={answerMeta?.answerText} />
                        </AnswerSelectionHighlight>
                      </p>

                      <Row>
                        {answerMeta?.authorsUsers &&
                          answerMeta.authorsUsers.map((author, idx) => (
                            <Col key={idx}>
                              <Author
                                author={{
                                  name: author?.authorName,
                                  picture: author?.avtarUrl,
                                  title: author?.title,
                                  department: author?.departmentName,
                                }}
                                createdAt={answerMeta?.answerCreatedAt}
                              />
                            </Col>
                          ))}
                      </Row>

                      <BlankDiv />

                      <Row className="mt-1">
                        <Col className="col-8">
                          <Labels
                            labels={answerMeta?.labels}
                            answerId={answerMeta?.id}
                            showAddLabel={false}
                          />
                        </Col>
                        <Col className="col-4">
                          <span className="mx-1">&#128077;</span>
                          <Count>{answerMeta.reactionCount.upVote}</Count>
                          <span className="mx-1">&#128078;</span>
                          <Count>{answerMeta.reactionCount.downVote}</Count>
                          <span className="mx-1">
                            <FlagIcon height={20} />
                          </span>
                          <Count>{answerMeta.flags}</Count>
                          <Views>
                            <Count view>{answerMeta.views}</Count>Views
                          </Views>
                        </Col>
                      </Row>
                    </div>
                  </CardMain>
                )
            )}
          </div>
        )}

        {step === 2 && (
          <div className="questions">
            {allAnswers?.data
              .filter((e) => {
                if (answerList.includes(e.answerId)) {
                  return e;
                }
              })
              .map(
                (answer, index) =>
                  answer?.id !== answerId && (
                    <CardMain step2 key={index}>
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
                            <Count>{answer.reactionCount.upVote}</Count>
                            <span className="mx-1">&#128078;</span>
                            <Count>{answer.reactionCount.downVote}</Count>
                            <span className="mx-1">
                              <FlagIcon height={20} />
                            </span>
                            <Count>{answer.flags}</Count>
                            <Views>
                              <Count view>{answer.views}</Count>Views
                            </Views>
                          </Col>
                        </Row>
                      </div>
                    </CardMain>
                  )
              )}
          </div>
        )}

        {step == 1 ? (
          <div className="card-footer d-flex justify-content-between align-items-center mt-2">
            <span onClick={() => clearSelection()}>
              Clear selection (
              {Math.max(
                0,
                Object.values(checkedState).filter((item) => item === true)
                  .length - 1
              )}
              )
            </span>
            <Button
              type="button"
              variant="primary"
              onClick={() => moveNextStep()}
              disabled={answerList.length > 1 ? false : true}
            >
              Select to Merge
            </Button>
          </div>
        ) : (
          <div className="card-footer d-flex justify-content-between align-items-center mt-2">
            <span
              onClick={() => {
                setStep(1);
              }}
            >
              Edit selection
            </span>
            <Button
              type="button"
              variant="primary"
              onClick={() => sendRequest()}
              disabled={answerList.length > 0 ? false : true}
            >
              Request to Merge
            </Button>
          </div>
        )}
      </div>

      <MergeSuccessPopup
        adminName={adminName}
        showMergeSuccessPopup={showMergeSuccessPopup}
        setShowMergeSuccessPopup={setShowMergeSuccessPopup}
        type="Request"
        mergeType="Answer"
        questionId={questionId}
      />
    </CardView>
  );
}

const Views = styled.span`
  font-family: Barlow Condensed;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 17px;
  text-align: right;
  color: #81c2c0;
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

const AnswerSelectionHighlight = styled.div`
  font-weight: ${(props) => (props.selected ? "bold" : "")};
`;

const StyledCardHeader = styled.div`
  padding-bottom: 5px !important;
`;

const StyledButton = styled.button`
  background-color: transparent;
`;

const BlankDiv = styled.div`
  height: 10px;
`;

const Header = styled.div`
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  text-align: left;
  color: #1f5462;
`;

const Button = styled(BsButton)`
  &&& {
    width: 170px;
    background: #81c2c0;
    border: none;
    color: #fff !important;
    height: 50px;
    font-size: 20px;
    &:hover,
    &:active,
    &:focus {
      color: #ffffff !important;
      background: #81c2c0;
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
    .title {
      font-family: "Barlow Condensed", sans-serif;
      font-weight: 500;
      font-size: 40px;
      color: #1f5462;
      line-height: 1.2;
    }
    .desc {
      font-family: "Manrope", sans-serif;
      font-size: 16px;
      color: #393d3e;
      line-height: 1.2;
      margin-top: 10px;
    }
    .filterMeta {
      span {
        display: inline-block;
        color: #81c2c0;
        font-family: "Barlow Condensed", sans-serif;
        font-weight: 500;
        font-size: 20px;
        line-height: 1.2;
      }
      @media (max-width: 549px) {
        flex-basis: 100%;
        justify-content: flex-start !important;
      }
    }
  }
  .card-footer {
    padding: 25px 35px;
    background-color: #fff;
    border-top: 1px solid #c4c4c4;
    margin-top: 0;
    span {
      display: inline-block;
      color: #81c2c0;
      font-family: "Barlow Condensed", sans-serif;
      font-size: 20px;
      font-weight: 500;
      cursor: pointer;
    }
  }
  .parentCard {
    background-color: #f5f5f5;
    padding: 25px 35px;
    > div {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }
    .meta-1 {
      width: 15px;
    }
    .meta2 {
      padding-left: 30px;
    }
  }
  .questions {
    padding: 25px 35px;
  }
`;

const ClearButton = styled(BsButton)`
  &&& {
    display: flex;
    align-items: center;
    padding: 0 0.25rem;
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
  .meta1 {
    position: absolute;
    left: 0;
    top: 0;
    width: 45px;
    display: flex;
    justify-content: space-between;
  }
  .meta2 {
    padding-left: ${(props) => (props.step2 ? "30px" : "60px")};
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

const StyledInputGroup = styled(InputGroup)`
  &&& {
    width: fit-content;
    margin-left: 0.5rem;
    color: #003647;
    font-family: "Barlow Condensed", sans-serif;
    border: 0.5px solid #003647;
    border-radius: 0.25rem;
    .input-group-text {
      background: #fff;
      border: none;
      padding: 0.375rem 0.5rem;
    }
  }
`;

const Input = styled(DebounceInput)`
  &&& {
    border: none;
    padding-left: 0;
  }
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
