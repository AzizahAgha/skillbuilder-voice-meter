import {
  Modal as BSModal,
  Button as BsButton,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { IoIosCloseCircleOutline } from "react-icons/io";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Labels from "@ui-library/Labels";
import Author from "@ui-library/Author";
import { IoSearchOutline } from "react-icons/io5";
import { DebounceInput } from "react-debounce-input";
import SerialNumberUI from "@ui-library/SerialNumberUI";
import FiltersModal from "@components/filters/FiltersModal";
import questionService from "@services/question.service";
import Checkbox from "@ui-library/Checkbox";
import { useTeam } from "@contexts/TeamContext";
import Tooltip from "@ui-library/Tooltip";
import { useQuery } from "react-query";
import Bus from "@utils/Bus";

function AddFlashcardQuestionsPopup({
  show,
  setShow,
  title,
  questions,
  setTitle,
  setSelection,
  handleSubmit,
  questionsFlashcardQuery,
  flashcardMutation,
}) {
  const [results, setResults] = useState(null);
  const { team } = useTeam();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [checkedState, setCheckedState] = useState({});
  const [questionList, setQuestionList] = useState([]);
  const { data: allQuestions, refetch: refetchQuest } = useQuery(
    ["questions", { teamId: team?.id, filters, searchString: searchKeyword }],
    () =>
      questionService.getAllQuestions({
        teamId: team?.id,
        filters,
        params: { type: "all" },
        searchString: searchKeyword,
      }),
    {
      enabled: team && show === true ? true : false,
      onSuccess: (res) => {
        const selected = {};
        res?.data.map((questionMeta) => {
          if (questions.includes(questionMeta.id)) {
            selected[questionMeta.id] = true;
          } else {
            selected[questionMeta.id] = false;
          }
        });
        setQuestionList(questions);
        setCheckedState(selected);
        setIsLoaded(true);
        setResults(
          res?.data?.filter((question) => question.status !== "Archived").length
        );
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const handleOnChange = (e, questionId) => {
    if (questionList.length >= 20 && e.target.checked) return;

    setCheckedState({
      ...checkedState,
      [questionId]: !checkedState[questionId],
    });
    if (e.target.checked === true) {
      setQuestionList((old) => {
        return [...new Set([...old, questionId])];
      });
    }
    if (e.target.checked === false) {
      setQuestionList((old) => {
        return [...new Set([...old].filter((e) => e !== questionId))];
      });
    }
  };

  const clearSelection = () => {
    const newCheckedState = {};
    for (var key in checkedState) {
      newCheckedState[key] = false;
    }
    setCheckedState(newCheckedState);
    setQuestionList([]);
  };

  useEffect(() => {
    setResults(
      allQuestions?.data.filter((question) => question.status !== "Archived")
        ?.length
    );
    if (show) {
      refetchQuest();
    }
  }, [show]);

  const checkBtnDisabled = () => {
    if (
      questionList.length === 0 ||
      setTitle.trim() === "" ||
      Object.values(checkedState).filter((item) => item === true).length === 0
    )
      return true;
    else return false;
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
        <div className="card-header">
          <CloseButton
            type="button"
            onClick={() => {
              setShow(false);
            }}
          >
            <IoIosCloseCircleOutline size={30} color="#969C9D" />
          </CloseButton>
          <div className="title">{`Add Questions To ${title}`}</div>

          <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
            <div className="d-flex align-items-center">
              <FiltersModal
                hideAnswerFilters={true}
                onFiltersChange={setFilters}
                setResults={setResults}
                addQuestionPopup={true}
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
            </div>
          </div>
        </div>

        <div className="card-content">
          {isLoaded && allQuestions?.data.length > 0 && (
            <div className="questions">
              {allQuestions?.data
                .filter((question) => question.status !== "Archived")
                .map((questionMeta, index) => (
                  <CardMain key={`popupCheckbox-${questionMeta?.id}`}>
                    <div className="meta1 d-flex">
                      <Checkbox
                        id={`custom-checkbox-${questionMeta?.id}`}
                        name={`custom-checkbox-${questionMeta?.id}`}
                        checked={checkedState[questionMeta?.id]}
                        onChange={(e) => handleOnChange(e, questionMeta?.id)}
                        disabled={questionMeta?.status === "Archived"}
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
                ))}
            </div>
          )}
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
              onClick={() => {
                const obj = {};
                questionList.forEach((qId) => {
                  obj[`${qId}`] = true;
                });

                setSelection(obj);
                handleSubmit();
              }}
              disabled={checkBtnDisabled()}
            >
              {flashcardMutation?.isLoading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                  variant="light"
                />
              ) : (
                `  Add
              ${
                Object.values(checkedState).filter((item) => item === true)
                  .length
              }
              Questions & Save`
              )}
            </Button>
          </div>
        </div>
      </CardView>
    </Modal>
  );
}

export default AddFlashcardQuestionsPopup;

const BlankDiv = styled.div`
  height: 10px;
`;

const SpinnerDiv = styled.div`
  display: flex;
  min-height: 50px;
  justify-content: center;
  align-items: center;
`;

const Button = styled(BsButton)`
  &&& {
    width: 200px;
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

  .questions {
    padding: 25px 35px;
    overflow: auto;
    max-height: 500px;
    width: 97%;
    margin: auto;
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

const CloseButton = styled.button`
  background: transparent;
  border: none;
  display: inline-block;
  position: absolute;
  right: 4px;
  top: 30px;
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
  }
`;
