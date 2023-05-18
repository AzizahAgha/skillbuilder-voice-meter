import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Labels from "@ui-library/Labels";
import Author from "@ui-library/Author";
import { Button as BsButton, InputGroup } from "react-bootstrap";
import { IoSearchOutline } from "react-icons/io5";
import { DebounceInput } from "react-debounce-input";
import SerialNumberUI from "@ui-library/SerialNumberUI";
import FiltersModal from "@components/filters/FiltersModal";
import questionService from "@services/question.service";
import Checkbox from "@ui-library/Checkbox";
import { useTeam } from "@contexts/TeamContext";
import Tooltip from "@ui-library/Tooltip";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Markup } from "interweave";
import { useQuery, useMutation } from "react-query";
import MergeSuccessPopup from "@ui-library/MergeSuccessPopup";
import { useRouter } from "next/router";
import Bus from "@utils/Bus";

export default function MergeCardView({
  type,
  parentID,
  parentData,
  userName,
  adminName,
  questionId,
  teamId,
}) {
  const router = useRouter();
  const { team } = useTeam();
  const [step, setStep] = useState(type === "popup" ? 2 : 1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [checkedState, setCheckedState] = useState({});
  const [showMergeSuccessPopup, setShowMergeSuccessPopup] = useState(false);
  const mergeMutation = useMutation(({ data }) =>
    questionService.mergeQuestions({
      data: data,
      teamId: teamId,
      questionId: questionId,
    })
  );
  const {
    data: allQuestions,
    isError,
    refetch: refetchQuestionList,
  } = useQuery(
    ["questions", { teamId: team?.id, filters, searchString: searchKeyword }],
    () =>
      questionService.getAllQuestions({
        teamId: team?.id,
        filters,
        params: { type: "all" },
        searchString: searchKeyword,
      }),
    {
      enabled: team ? true : false,
      onSuccess: (res) => {
        const selected = {};
        res?.data.map((questionMeta) => {
          selected[questionMeta.id] = false;
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

  const handleOnChange = (e, questionId) => {
    if (questionList.length >= 3 && e.target.checked) return;
    setCheckedState({
      ...checkedState,
      [questionId]: !checkedState[questionId],
    });
  };

  const moveNextStep = () => {
    setStep(2);
  };

  const sendRequest = () => {
    mergeMutation
      .mutateAsync({
        data: {
          mergeType: "Question",
          questions: questionList,
          message: (contentTop + message + contentBot).replaceAll(
            "\n",
            "<br />"
          ),
          isActingSuperAdmin: localStorage.getItem('isSuperAdminView') === 'true' ? true:false
        },
      })
      .then(setShowMergeSuccessPopup(true));
  };

  const clearSelection = () => {
    const newCheckedState = {};
    for (var key in checkedState) {
      newCheckedState[key] = false;
    }
    setCheckedState(newCheckedState);
  };

  const [questionList, setQuestionList] = useState([]);

  useEffect(() => {
    const newQuestionList = Object.entries(checkedState)
      .filter((e) => e[1] === true)
      .map((e) => e[0]);
    setQuestionList(newQuestionList);
  }, [checkedState]);

  const contentTop = `Hi ${adminName} ,` + "\n" + "\n";
  const contentBot = "\n" + "\n" + `- ${userName}`;
  const [message, setMessage] = useState(
    `I think we can merge these questions (and their answers) - do you agree?`
  );
  const [results, setResults] = useState(null);

  return (
    <CardView>
      <div className="card-header">
        <div className="title">Merge Questions</div>
        <div className="desc">
          <b>Step {step} of 2: </b>
          {step == 1 ? (
            <span
              dangerouslySetInnerHTML={{
                __html:
                  "Select up to <b>3 questions</b> from below to merge. The first question selected will be the main question displayed after merging.",
              }}
            />
          ) : (
            "Send a message to you Admin with your merge request."
          )}
        </div>

        {step == 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
            <div className="d-flex align-items-center">
              <FiltersModal
                hideAnswerFilters={true}
                onFiltersChange={setFilters}
                setResults={setResults}
              />

              <StyledInputGroup>
                <InputGroup.Text>
                  <IoSearchOutline color="#003647" size={20} />
                </InputGroup.Text>

                <Input
                  type="search"
                  minLength={2}
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
              <span>{results} Results</span>
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
            <Header className="mt-4 mb-2">Questions to Merge</Header>
          </StyledCardHeader>
        )}
        <div className="parentCard">
          <CardMain>
            {step === 1 && (
              <div className="meta1">
                <SerialNumberUI value={parentData?.number} />
              </div>
            )}

            <div className="meta2">
              <p className="questionContent">
                <b>{parentData?.questionText}</b>
              </p>
              <Author
                author={parentData?.author}
                createdAt={parentData?.createdAt}
              />
              <BlankDiv />
              <Labels
                labels={parentData?.labels}
                questionId={parentData?.id}
                showAddLabel={false}
              />
            </div>
          </CardMain>
        </div>
        {step === 1 && isLoaded && allQuestions?.data.length > 0 && (
          <div className="questions">
            {allQuestions?.data.map(
              (questionMeta) =>
                questionMeta?.id !== parentData?.id && (
                  <CardMain>
                    <div className="meta1 d-flex">
                      <Checkbox
                        id={`custom-checkbox-${questionMeta?.id}`}
                        name={`custom-checkbox-${questionMeta?.id}`}
                        checked={checkedState[questionMeta?.id]}
                        onChange={(e) => handleOnChange(e, questionMeta?.id)}
                      />
                      <SerialNumberUI value={questionMeta?.number} />
                    </div>
                    <div className="meta2">
                      <p className="questionContent">
                        {questionMeta?.questionText}
                      </p>
                      <Author
                        author={questionMeta?.author}
                        createdAt={questionMeta?.createdAt}
                      />
                      <BlankDiv />
                      <Labels
                        labels={questionMeta?.labels}
                        questionId={questionMeta?.id}
                        showAddLabel={false}
                      />
                    </div>
                  </CardMain>
                )
            )}
          </div>
        )}

        {step === 2 && (
          <div className="questions">
            {allQuestions?.data
              .filter((e) => {
                if (questionList.includes(e.questionId)) {
                  return e;
                }
              })
              .map((question, index) => (
                <CardMain step2 key={index}>
                  <div className="meta2">
                    <p className="questionContent">{question?.questionText}</p>
                    <Author
                      author={question?.author}
                      createdAt={question?.createdAt}
                    />
                    <BlankDiv />
                    <Labels
                      labels={question?.labels}
                      questionId={question?.id}
                      showAddLabel={false}
                    />
                  </div>
                </CardMain>
              ))}
          </div>
        )}

        {step == 1 ? (
          <div className="card-footer d-flex justify-content-between align-items-center mt-2">
            <span onClick={() => clearSelection()}>
              Clear selection (
              {
                Object.values(checkedState).filter((item) => item === true)
                  .length
              }
              )
            </span>
            <Button
              type="button"
              variant="primary"
              onClick={() => moveNextStep()}
              disabled={questionList.length > 0 ? false : true}
            >
              Select to Merge
            </Button>
          </div>
        ) : (
          <div className="card-footer d-flex justify-content-between align-items-center mt-2">
            <span onClick={() => setStep(1)}>Edit selection</span>
            <Button
              type="button"
              variant="primary"
              onClick={() => sendRequest()}
              disabled={questionList.length > 0 ? false : true}
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
        mergeType="Question"
      />
    </CardView>
  );
}

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
