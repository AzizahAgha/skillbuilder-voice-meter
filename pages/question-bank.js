import { getPageFromWebflow, createReactPageFromHTML } from "../utils/helpers";
import Head from "next/head";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Container,
  Button as BsButton,
  Col,
  Row,
  InputGroup,
  Form,
} from "react-bootstrap";
import { BsCheckCircle } from "react-icons/bs";
import teamService from "@services/team.service";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "react-query";
import { Spinner } from "react-bootstrap";
import { useAsyncDebounce } from "react-table";
import { useAuthUser } from "@contexts/AuthContext";
import Checkbox from "@ui-library/Checkbox";
import questionBankService from "@services/questionBank.service";
import { useTeam } from "@contexts/TeamContext";
import { IoSearchOutline } from "react-icons/io5";
import { DebounceInput } from "react-debounce-input";
import QuestionBankFiltersModal from "@components/filters/FiltersQuestionBank";
import StepProgress from "@components/questionBank/StepProgress";
import QuestionList from "@components/questionBank/QuestionList";
import Labels from "@ui-library/Labels";
import transformQuestionsForSaving from "@transformers/questionsForSaving.transformer";
import questionService from "@services/question.service";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Tooltip from "@ui-library/Tooltip";
import DetailPageHeader from "@ui-library/DetailPageHeader";
import Link from "next/link";
import Error from "@components/error";
import Authorization from "@contexts/Authorization";
import Bus from "@utils/Bus";
import { id } from "date-fns/locale";

export function QuestionBank() {
  const router = useRouter();
  const { auth, isLoading, refetchAuthUser } = useAuthUser();
  const [suggestions, setSuggestions] = useState(null);
  const [error, setError] = useState("");
  const [questionBank, setQuestionBank] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const { team, setTeam, refetchTeam } = useTeam();
  const [isCreated, setisCreated] = useState(false);
  const [progressState, setprogressState] = useState(0);
  const [checkedState, setCheckedState] = useState({});
  const [selectedQ, setSelected] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filters, setFilters] = useState({
    departments: [],
    contexts: [],
    themes: [],
  });
  const [initalVals, setinitalVals] = useState({});
  const [teamName, setteamName] = useState("");
  const [progressStep, setProgress] = useState(1);
  const [isqBankLoading, setIsqBankLoading] = useState(false);
  const [resetForm, setResetForm] = useState(0);
  const qBanksize = "";
  const [isPageLoaded, setisPageLoaded] = useState(false);
  const [isPage404, setisPage404] = useState(false);

  useEffect(() => {
    if (router.isReady && !isLoading) {
      setisPageLoaded(true);
      if (router.query.type == "detail" || router.query.type == "getStarted") {
        if (router.query.type == "detail" && auth?.isAuthenticated) {
          setisPage404(false);
        } else if (router.query.type == "getStarted") {
          setisPage404(false);
        } else {
          setisPage404(true);
        }
      } else {
        setisPage404(true);
      }
    }
  }, [router, isLoading]);

  const teamNameSuggestionMutation = useMutation(
    (teamName) => teamService.suggestions(teamName),
    {
      onSuccess: (res) => {
        setSuggestions(res);
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const handleKeyPress = useAsyncDebounce((event) => {
    setProgress(1);
    const value = event.target.value.replace(/^\s+|\s+$/gm, "");
    const teamName = value;
    if (teamName) {
      teamNameSuggestionMutation?.mutate(teamName);
    }
  }, 500);

  const { data: questionBankData } = useQuery(
    [
      "questionBank",
      { size: qBanksize, search: searchKeyword, qfilters: filters },
    ],
    () =>
      questionBankService.get({
        size: qBanksize,
        search: searchKeyword.toLowerCase(),
        qfilters: filters,
      }),
    {
      onSuccess: async (res) => {
        setIsqBankLoading(true);
        setQuestionBank(await res.data);
        let obj = {};
        res?.data.map((questionMeta) => {
          obj[questionMeta.id] = false;
        });
        const localData = localStorage.getItem("questionnaire");
        const selectedQuestions = JSON.parse(localData)?.values;
        if (selectedQuestions?.questions) {
          selectedQuestions.questions.map((v) => {
            obj[v.qBankId] = true;
          });
          setSelected(selectedQuestions.questions);
        }
        setCheckedState(obj);
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const { data: questionBankFilters } = useQuery(
    ["questionBankFilters"],
    () => questionBankService.getFilters(),
    {
      onSuccess: async (res) => {
        let qfilters = {};
        let initalvals = {};
        if (res.data) {
          const filterData = res.data;
          Object.keys(filterData).map((key, index) => {
            let obj = {};
            let arr = [];
            filterData[key].map((filter) => {
              obj = { value: filter, label: filter };
              arr.push(obj);
            });
            qfilters[key] = arr;
            initalvals[key] = [];
          });
        }
        setFilterData(qfilters);
        setinitalVals(initalvals);
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const teamMutation = useMutation((teamData) => teamService.create(teamData), {
    onSuccess: (data) => {
      setTeam(data);
    },
    onError: (error) => {
      Bus.emit("error", { operation: "open", error: error.response });
    },
  });

  const trimQuestions = (questions) =>
    questions.filter(({ question }) => question.trim());

  const questionMutation = useMutation(
    ({ teamId, questions }) => questionService.batchUpdate(teamId, questions),
    {
      onSuccess: (res) => {
        localStorage.removeItem("ORG");
        localStorage.removeItem("teamName");
        localStorage.removeItem("questionnaire");
        refetchTeam();
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  // useEffect(() => {
  //   if(!localStorage.getItem("ORG") && !localStorage.getItem("teamName") && router.query.type!= 'detail'){
  //     auth?.isAuthenticated && router.push("/detail");
  //   }
  // }, [auth,isCreated]);
  const handleSubmit = () => {
    const displayName = localStorage.getItem("ORG");
    const teamName = localStorage.getItem("teamName");

    if (displayName || teamName) {
      teamMutation.mutateAsync({ teamName, displayName }).then((res) => {
        const localData = localStorage.getItem("questionnaire");
        const { questions } = JSON.parse(localData)?.values;

        // refetchAuthUser().then((res1) => {
        //   if (res1.status === "success") {
        //     setError("");
        //   } else if (res1.status === "error") {
        //     setError("Email address not found.");
        //     logout();
        //   }
        // });

        const data = transformQuestionsForSaving(trimQuestions(questions));
        if (data.questions?.length > 0) {
          questionMutation
            .mutateAsync({
              teamId: res.teamId,
              questions: data,
            })
            .then(() => {
              setisCreated(true);
              auth?.isAuthenticated && router.push("/detail");
            });
        } else {
          localStorage.removeItem("ORG");
          localStorage.removeItem("teamName");
          localStorage.removeItem("questionnaire");
          setisCreated(true);
          router.push("/detail");
        }
      });
    } else {
      setError("Please select team to continue! ");
    }
  };

  const onLoginSuccess = () => {
    // setprogressState(1);
    // setProgress(3);
    // const displayName = localStorage.getItem("ORG");
    // const teamName = localStorage.getItem("teamName");
    // if (displayName || teamName) {
    //   teamMutation.mutateAsync({ teamName, displayName }).then((res) => {
    //     const localData = localStorage.getItem("questionnaire");
    //     const { questions } = JSON.parse(localData)?.values;
    //     refetchAuthUser();
    //     const data = transformQuestionsForSaving(trimQuestions(questions));
    //     if (data?.questions.length > 0) {
    //       questionMutation
    //         .mutateAsync({
    //           teamId: res.teamId,
    //           questions: data,
    //         })
    //         .then(() => {
    //           setisCreated(true);
    //           auth?.isAuthenticated && router.push("/detail");
    //         });
    //     } else {
    //       localStorage.removeItem("ORG");
    //       localStorage.removeItem("teamName");
    //       localStorage.removeItem("questionnaire");
    //       setisCreated(true);
    //       router.push("/detail");
    //     }
    //   });
    // } else {
    //   setError("Please select team to continue! ");
    // }
  };

  const handleOnChange = (event, questionId, qText) => {
    setProgress(2);
    setCheckedState({
      ...checkedState,
      [questionId]: !checkedState[questionId],
    });
    let questions = [];
    let question = {
      question: qText,
      frequency: "Sometimes",
      importance: 3,
      confidence: 3,
      differentiation: 3,
      qBankId: questionId,
    };
    if (event.target.checked == true) {
      if (selectedQ) {
        questions = selectedQ;
        questions.push(question);
      } else {
        questions.push(question);
      }
    } else {
      questions = selectedQ;
      if (selectedQ.length > 0) {
        questions = questions.filter((question) => {
          return question.qBankId !== questionId;
        });
      }
      setSelected((current) =>
        current.filter((question) => {
          return question.qBankId !== questionId;
        })
      );
    }
    localStorage.setItem(
      "questionnaire",
      JSON.stringify({ values: { questions } })
    );
  };

  const addtoQuestions = () => {
    const localData = localStorage.getItem("questionnaire");
    if (localData) {
      const { questions } = JSON.parse(localData)?.values;
      const data = transformQuestionsForSaving(trimQuestions(questions));
      if (data?.questions.length > 0) {
        questionMutation
          .mutateAsync({
            teamId: team?.id,
            questions: data,
          })
          .then(() => {
            setisCreated(true);
            auth?.isAuthenticated && router.push("/detail");
          });
      } else {
        localStorage.removeItem("questionnaire");
        setisCreated(true);
      }
    }
  };

  const unSelectAll = () => {
    setSelected([]);
    setCheckedState({});
    localStorage.removeItem("questionnaire");
  };

  const saveForm = (event) => {
    setteamName(event.target.value);
    localStorage.setItem("ORG", event.target.value);
    localStorage.setItem("teamName", event.target.value);
    localStorage.setItem("answers", JSON.stringify([]));
  };

  return (
    <div className="bs">
      {isPageLoaded && !isPage404 ? (
        <>
          {router.query.type == "detail" && <DetailPageHeader />}
          {progressState === 1 ? (
            <StyledContainer>
              <PageTitle className="mt-4">Loading...</PageTitle>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-1"
                variant="secondary"
              />
            </StyledContainer>
          ) : (
            <StyledContainer>
              {router.query.type == "getStarted" ? (
                <Row className="align-items-end">
                  <Col className="col-12 col-md-12 col-lg-5">
                    <PageTitle>Library of Questions</PageTitle>
                  </Col>
                  <Col className="col-12 col-md-12 col-lg-7 d-flex justify-content-lg-end">
                   
                  </Col>
                </Row>
              ) : (
                <Authorization
                  allow={["member"]}
                  fallback={team ? <Error code={401} /> : ""}
                >
                  <Link href="/detail" passHref>
                    <a>
                      <Backbtn>&lt; Cancel & back</Backbtn>
                    </a>
                  </Link>
                  <Row className="mt-3">
                    <Col className="col-12 col-md-12 col-lg-8">
                      <PageTitle>SkillBuilder Question Bank</PageTitle>
                      <Description>
                        Below is a list of the top questions collected by
                        SkillBuilder that could benefit your team. Select the
                        questions you would like to add. All questions selected
                        will be added to the end of your current list of
                        questions.
                      </Description>
                    </Col>
                    <Col className="col-12 col-md-12 col-lg-4 justify-content-lg-end">
                      <Button className="mt-2" onClick={() => addtoQuestions()}>
                        Add {selectedQ.length} Question (s)
                      </Button>
                    </Col>
                  </Row>
                </Authorization>
              )}

              <Row className="my-md-5 my-3">
                <Col className="col-12 col-md-12 col-lg-4">
                  {router?.query?.type == "getStarted" ? (
                    <StepProgress
                      teamMutationLoading={teamMutation.isLoading}
                      questionMutationLoading={questionMutation.isLoading}
                      teamNameSuggestionMutation={teamNameSuggestionMutation}
                      handleKeyPress={handleKeyPress}
                      suggestions={suggestions}
                      saveForm={saveForm}
                      progressStep={progressStep}
                      setProgress={setProgress}
                      teamName={teamName}
                      selectedQ={selectedQ}
                      onLoginSuccess={onLoginSuccess}
                      error={error}
                      checkedState={checkedState}
                      handleOnChange={handleOnChange}
                      setteamName={setteamName}
                      auth={auth}
                      handleSubmit={handleSubmit}
                    />
                  ) : (
                    <Authorization
                      allow={["member"]}
                      fallback={team ? <Error code={401} /> : ""}
                    >
                      <QuestionList
                        selectedQ={selectedQ}
                        checkedState={checkedState}
                        handleOnChange={handleOnChange}
                        unSelectAll={unSelectAll}
                      />
                    </Authorization>
                  )}
                </Col>
                <Col className="col-12 col-md-12 col-lg-8">
                  <CardView>
                    <div className="card-header">
                      <CardTitle>Questions</CardTitle>
                      <Description>
                        Below is a list of the top questions collected by
                        SkillBuilder that could benefit your team. Filter and
                        search for a few starter questions. On the following
                        steps you’ll be able to enter and add any additional
                        questions you have that were not listed and invite
                        colleagues to help you answer them. Still have
                        questions? Please Contact Us.
                      </Description>

                      <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
                        <div className="d-flex align-items-center">
                          {
                            <QuestionBankFiltersModal
                              filterData={filterData}
                              initalVals={initalVals}
                              filters={filters}
                              onFiltersChange={setFilters}
                              resultCount={questionBank.length}
                              setResetForm={setResetForm}
                              resetForm={resetForm}
                            />
                          }

                          <StyledInputGroup>
                            <InputGroup.Text>
                              <IoSearchOutline color="#003647" size={20} />
                            </InputGroup.Text>

                            <Input
                              type="search"
                              minLength={2}
                              debounceTimeout={300}
                              value={searchKeyword}
                              onChange={(e) => {
                                setIsqBankLoading(false);
                                setSearchKeyword(e.target.value);
                              }}
                              placeholder="Search Questions"
                              className="form-control"
                            />

                            {searchKeyword && (
                              <Tooltip text="Clear" placement="right">
                                <ClearButton
                                  variant="default"
                                  onClick={() => setSearchKeyword("")}
                                >
                                  <IoIosCloseCircleOutline
                                    color="#969C9D"
                                    size={20}
                                  />
                                </ClearButton>
                              </Tooltip>
                            )}
                          </StyledInputGroup>
                        </div>
                        <FilterMeta className="d-flex justify-content-between align-items-center">
                          <span>{questionBank.length} Results</span>
                          <span className="mx-2">|</span>
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setIsqBankLoading(false);
                              setFilters({});
                              setResetForm(1);
                            }}
                          >
                            {" "}
                            Clear Filter
                          </span>
                        </FilterMeta>
                      </div>
                    </div>
                    <div className="card-content">
                      <div className="d-block qBank">
                        {questionBank.length > 0 ? (
                          questionBank.map((qb, index) => (
                            <div
                              key={`qBankTable-${index}`}
                              className={
                                checkedState[qb.id] == true
                                  ? "item checked"
                                  : "item"
                              }
                            >
                              <Checkbox
                                className="form-check"
                                id={`bcustom-checkbox-${qb.id}`}
                                name={`bcustom-checkbox-${qb.id}`}
                                label={qb.question}
                                checked={checkedState[qb.id]}
                                onChange={(e) =>
                                  handleOnChange(e, qb.id, qb.question)
                                }
                              />
                              <Labels
                                labels={qb?.department}
                                questionId={qb.id}
                                showAddLabel={false}
                              />
                            </div>
                          ))
                        ) : (
                          <p>
                            {isqBankLoading ? "No results found" : "Loading..."}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardView>
                </Col>
              </Row>
            </StyledContainer>
          )}
        </>
      ) : (
        isPageLoaded && <Error code={404} />
      )}
    </div>
  );
}

const StyledContainer = styled(Container)`
  &&& {
    margin-top: 70px;
    @media (max-width: 768px) {
      margin-top: 40px;
    }
  }
`;

const PageTitle = styled.p`
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 600;
  font-size: 50px;
  color: #81c2c0;
  line-height: 1.2;
  margin: 0 !important;
  @media (max-width: 768px) {
    font-size: 30px;
  }
  @media (max-width: 992px) {
    margin-bottom: 16px !important;
  }
`;

const Backbtn = styled.div`
  cursor: pointer;
  display: inline-block;
  font-family: "Manrope", sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #393d3e;
`;

const Description = styled.div`
  font-family: "Manrope", sans-serif;
  font-size: 16px;
  color: #393d3e;
  line-height: 1.2;
  margin-top: 10px;
`;

const CardTitle = styled.div`
  font-family: "Barlow Condensed", sans-serif;
  font-weight: 500;
  font-size: 34px;
  color: #1f5462;
  line-height: 1.2;
`;

const FilterMeta = styled.div`
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
`;

const CardView = styled.div`
  background: #fff;
  margin: 0 0 50px;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
  .card-header {
    padding: 25px 35px;
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border-radius: 5px !important;
  }
  .card-content {
    padding: 15px 15px 15px 35px;
  }
  .qBank {
    max-height: 750px;
    overflow-y: auto;
    padding-right: 10px;
    .item {
      border-bottom: 1px solid #c4c4c4;
      padding: 12px 0;
      &:last-child {
        border: none;
      }
      .form-check {
        margin-bottom: 10px;
      }
      &.checked {
        label {
          font-weight: 700;
        }
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

const ClearButton = styled(BsButton)`
  &&& {
    display: flex;
    align-items: center;
    padding: 0 0.25rem;
  }
`;

const Button = styled(BsButton)`
  &&& {
    background: #81c2c0;
    border: 1px solid #81c2c0;
    border-radius: 5px;
    font-family: "Barlow Condensed", sans-serif;
    font-style: normal;
    font-weight: 500;
    color: #ffffff;
    float: right;
    &:hover,
    &:active,
    &:focus {
      background: #8ed0ce;
      border-color: #8ed0ce;
      outline: none;
      box-shadow: none;
    }
  }
`;

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "detail") {
      return <QuestionBank />;
    }
    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/question-bank");

  return {
    props: { HEAD, BODY },
  };
}

export default function questionBankPage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}
