import React, { useState } from "react";
import { Form as FormikForm, Formik, Field, useFormikContext } from "formik";
import * as yup from "yup";
import styled from "styled-components";
import { Form } from "react-bootstrap";
import Button from "ui-library/Button";
import { useRouter } from "next/router";
import teamService from "@services/team.service";
import { useMutation } from "react-query";
import { Spinner } from "react-bootstrap";
import { useAsyncDebounce } from "react-table";
import { useEffect } from "react";
import { useAuthUser } from "@contexts/AuthContext";
import Checkbox from "@ui-library/Checkbox";
import questionBankService from "@services/questionBank.service";
import { useQuery } from "react-query";
import LoginCard from "@ui-library/LoginCard";
import transformQuestionsForSaving from "@transformers/questionsForSaving.transformer";
import { useTeam } from "@contexts/TeamContext";
import questionService from "@services/question.service";
import Bus from "@utils/Bus";
import Dropdown from "react-bootstrap/Dropdown";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function GetStartedForm1() {
  const router = useRouter();
  const { auth, isLoading, refetchAuthUser } = useAuthUser();
  const [suggestions, setSuggestions] = useState(null);
  const size = 3;
  const [error, setError] = useState("");
  const [questionBank, setQuestionBank] = useState([]);
  const { team, setTeam, refetchTeam } = useTeam();
  const [isCreated, setisCreated] = useState(false);
  const [progressState, setprogressState] = useState(0);
  const [isHomepageLogin, setIsHomepageLogin] = useState(false);
  const searchKeyword = "";
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

  const handleSubmit = () => {
    const displayName = localStorage.getItem("ORG");
    const teamName = localStorage.getItem("teamName");

    if (displayName || teamName) {
      teamMutation.mutateAsync({ teamName, displayName }).then((res) => {
        const localData = localStorage.getItem("questionnaire");
        const { questions } = JSON.parse(localData)?.values;

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

  const { data: questionBankData } = useQuery(
    ["questionBank", { size: size, search: searchKeyword }],
    () =>
      questionBankService.get({
        size: size,
        search: searchKeyword,
      }),
    {
      onSuccess: async (res) => {
        setQuestionBank(await res.data);
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

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

  const teamMutation = useMutation((teamData) => teamService.create(teamData), {
    onSuccess: (data) => {
      setTeam(data);
    },
    onError: (error) => {
      Bus.emit("error", { operation: "open", error: error.response });
    },
  });

  const onLoginSuccess = () => {
    setprogressState(1);
    setIsHomepageLogin(true);
  };

  const callQuestionBank = () => {
    router.push("/question-bank?type=getStarted");
  };

  const handleKeyPress = useAsyncDebounce((event) => {
    const value = event.target.value.replace(/^\s+|\s+$/gm, "");
    const teamName = value;
    if (teamName) {
      teamNameSuggestionMutation?.mutate(teamName);
    }
  }, 500);

  const AutoSubmitToken = () => {
    const { values, setFieldValue } = useFormikContext();

    useEffect(() => {
      localStorage.setItem("ORG", values.displayName);
      localStorage.setItem("teamName", values.teamName || values.displayName);
      localStorage.setItem("answers", JSON.stringify([]));

      let questions = [];
      values.question.length > 0 &&
        values.question.map((q, index) => {
          let question = {};
          questionBank.map((val, key) => {
            if (val.id == q) {
              question = {
                question: val.question,
                frequency: "Sometimes",
                importance: 3,
                confidence: 3,
                differentiation: 3,
                qBankId: val.id,
              };
            }
          });
          questions.push(question);
        });
      localStorage.setItem(
        "questionnaire",
        JSON.stringify({ values: { questions } })
      );
    }, [values]);
    return null;
  };

  useEffect(() => {
    if (auth?.user) {
      setprogressState(1);
    } else {
      setprogressState(0);
    }
  }, [auth]);

  useEffect(() => {
    if (isHomepageLogin === false && auth?.token) {
      router.push("/detail");
    }
  }, []);

  const CustomToggle = React.forwardRef(function myCustomToggle(
    { children, onClick },
    ref
  ) {
    return (
      <ToggleWrapper
        ref={ref}
        disabled={progressState === 0 ? true : false}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
        <StyledMdKeyboardArrowDown
          color="#393D3E"
          size={24}
          disabled={progressState === 0 ? true : false}
        />
      </ToggleWrapper>
    );
  });

  return (
    <Formik
      initialValues={{
        displayName: "",
        question: [],
        teamName: "",
      }}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <FormikForm className="bg-dark bs">
          {!isLoading && (
            <StyledFormWrapper>
              <FormContainer1>
                <Title>Differentiate with every deal</Title>
                <TitleText>
                  <b>SkillBuilder</b> is the fastest way to get everyone
                  answering the toughest sales and product questions when it
                  matters most.
                </TitleText>
                <AutoSubmitToken />
                {progressState === 0 ? (
                  <>
                    <GetStartedHeader>Get Started for Free</GetStartedHeader>
                    <TitleText>
                      Simply sign in and you&apos;ll be up and running in a few
                      minutes!{" "}
                    </TitleText>
                    <LoginCardWrapper
                      className="d-flex d-lg-flex "
                      id="step3Login"
                    >
                      <LoginCard onSuccess={onLoginSuccess} isLanding={true} />
                      {error && <Error>{error}</Error>}
                    </LoginCardWrapper>
                  </>
                ) : (
                  <WelcomeWrapper>
                    <ProfileImage
                      id="profile-pic-landing-page"
                      name="profile-pic-landing-page"
                      src={
                        auth?.user?.avtarUrl ||
                        "/images/default-user-avatar.jpg"
                      }
                      width={80}
                      height={80}
                    />
                    <WelcomeName>
                      Welcome <br /> {auth?.user?.firstName}
                    </WelcomeName>
                  </WelcomeWrapper>
                )}
              </FormContainer1>
              <FormContainer2>
                <FormContainer2Sub>
                  <FormGroupTeam
                    // controlId="displayName"
                    opacity={progressState === 0 ? "0.7" : "1"}
                  >
                    <Formlabel> Team Name</Formlabel>
                    <TitleText>
                      What do you want to call your team?{" "}
                    </TitleText>
                    <StyledField
                      as={Form.Control}
                      name="displayName"
                      type="text"
                      placeholder="Type your organization’s name here"
                      required
                      onKeyDown={handleKeyPress}
                      onChange={(e) => {
                        formik.setFieldValue("displayName", e.target.value);
                      }}
                      minLength={3}
                      maxLength={100}
                      disabled={progressState === 0 ? true : false}
                    />
                    {teamNameSuggestionMutation?.isLoading && (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-1"
                        variant="secondary"
                      />
                    )}
                  </FormGroupTeam>

                  {suggestions && suggestions.length > 0 && (
                    <FormGroup controlId="teamName">
                      <Form.Label className="text-warning">
                        A team name with the exact same name already exists.
                        Please change the name or select one of the below three
                        options or create a unique team name.
                      </Form.Label>
                      {suggestions.map((suggestion, idx) => (
                        <StyledSuggestionField
                          key={idx}
                          as={FormCheck}
                          type="radio"
                          name="teamName"
                          id={`suggestion-${idx}`}
                          value={suggestion}
                          label={suggestion}
                          maxLength={1000}
                          onChange={(e) => {
                            formik.setFieldValue("teamName", e.target.value);
                          }}
                          required
                        />
                      ))}
                    </FormGroup>
                  )}

                  <StyledDiv />

                  <Formlabel
                    id="starter-question"
                    opacity={progressState === 0 ? "0.7" : "1"}
                  >
                    Starter Question
                  </Formlabel>
                  <TitleText opacity={progressState === 0 ? "0.7" : "1"}>
                    What question do you wish your entire team could answer?{" "}
                  </TitleText>

                  <StyledDropdown opacity={progressState === 0 ? "0.7" : "1"}>
                    <Dropdown.Toggle
                      as={CustomToggle}
                      id="dropdown-custom-components"
                    >
                      {formik.values.question.length > 0
                        ? `Question ${formik.values.question.length} of ${questionBank.length} Selected`
                        : `Select Questions`}
                    </Dropdown.Toggle>

                    <Dropdown.Menu id="dropdown-menu">
                      {questionBank.map((qb, index) => (
                        <Field
                          key={index}
                          as={StyledCheckbox}
                          type="checkbox"
                          name="question"
                          id={qb.id}
                          value={qb.id}
                          label={qb.question}
                        />
                      ))}
                    </Dropdown.Menu>
                  </StyledDropdown>

                  <QuestionBank
                    onClick={() => {
                      if (progressState !== 0) {
                        callQuestionBank();
                      }
                    }}
                    opacity={progressState === 0 ? "0.7" : "1"}
                    disabled={progressState === 0 ? true : false}
                  >
                    View Skillbuilder&apos;s Library of Questions &#62;
                  </QuestionBank>
                  <div style={{ textAlign: "right" }}>
                    <StyledButton
                      type="submit"
                      disabled={
                        progressState === 0 || !formik.dirty ? true : false
                      }
                    >
                      {!formik.isSubmitting ? (
                        <> Get Started</>
                      ) : (
                        <LoadingWrapper>
                          Loading
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-1"
                            color="#fff"
                          />
                        </LoadingWrapper>
                      )}
                    </StyledButton>
                  </div>
                </FormContainer2Sub>
              </FormContainer2>
            </StyledFormWrapper>
          )}
        </FormikForm>
      )}
    </Formik>
  );
}

const StyledMdKeyboardArrowDown = styled(MdKeyboardArrowDown)`
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled(Button)`
  &&& {
    margin: 40px 0px 20px 0px;
    opacity: ${(props) => (props.disabled ? "0.7" : "1")};
    cursor: ${(props) => (props.disabled ? "default" : "pointer")} !important;
  }
`;

const WelcomeWrapper = styled.div`
  display: flex;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  margin: 150px 0px 20px 0px;
`;

const WelcomeName = styled.div`
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 1.2;
  margin-left: 1.5rem;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #81c2c0;
`;

const QuestionBank = styled.div`
  font-family: "Manrope";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 19px;
  text-align: right;
  text-transform: capitalize;
  color: #ffffff;
  cursor: pointer;
  opacity: ${(props) => (props.opacity ? props.opacity : "1")};
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  white-space: nowrap;
  &:hover {
    color: #81c2c0;
  }
`;

const ToggleWrapper = styled.button`
  display: flex;
  flex-wrap: nowrap;
  padding: 10px;
  font-family: "Manrope" !important;
  font-style: normal !important;
  font-weight: 400 !important;
  font-size: 16px !important;
  line-height: 22px !important;
  color: #393d3e;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: #ffffff;
  border-radius: 5px !important;
`;

const StyledDropdown = styled(Dropdown)`
  background: #ffffff;
  border-radius: 5px;
  margin: 10px 0px 10px 0px;
  opacity: ${(props) => (props.opacity ? props.opacity : "1")};
  button {
    padding: 8px 12px;
    font-size: 14px !important;
  }
  .dropdown-toggle {
    width: 100%;
    white-space: normal;
    border: none;
    background-color: #fff;
    font-family: "Manrope";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    color: #393d3e;
  }
`;

const StyledDiv = styled.div`
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.5);
  margin: 1rem 0;
`;

const StyledSuggestionField = styled(Field)`
  &&& {
    color: #fff;
  }
`;

const StyledField = styled(Field)`
  &&& {
    background: #ffffff;
    border: 1px solid #ffffff;
    border-radius: 5px;
    font-family: "Manrope";
    font-style: normal;
    font-weight: 400;
    font-size: 14px !important;
    line-height: 1.2;
    color: #393d3e;
    margin: 10px 0px 10px 0px;
    height: 40px;
  }
`;

const StyledFormWrapper = styled.div`
  &&& {
    display: flex;
    min-width: 500px;
    margin-top: 60px;
   
    @media (min-width: 992px) {
      width: 100%;
    }
    @media (max-width: 625px) {
      min-width: 100%;
      flex-wrap: wrap;
    }
  }
`;

const FormContainer1 = styled.div`
  background: #003647;
  mix-blend-mode: normal;
  border-radius: 4px 0px 0px 4px;
  flex-basis: 40%;
  min-height: 520px;
  padding: 1.5rem;
  font-family: Manrope;
  font-style: normal;
  font-weight: normal;
  font-size: 12.5px;
  line-height: 25px;
  color: #ffffff;
  @media (max-width: 625px) {
    flex-basis: 100%;
    min-height: 100%;
  }
`;

const FormContainer2 = styled.div`
  background: rgba(255, 255, 255, 0.1);
  mix-blend-mode: normal;
  border-radius: 4px;
  flex-basis: 60%;
  min-height: 520px;
  padding: 1.5rem;
  max-width: 420px;
  @media (max-width: 625px) {
    min-height: 100%;
    max-width: 100%;
    flex-basis: 100%;
  }
`;

const FormContainer2Sub = styled.div`
  max-width: 360px;
  @media (max-width: 625px) {
    max-width: 100%;
  }
`;

const Title = styled.div`
  font-family: "Manrope";
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  line-height: 1.2;
  text-transform: capitalize;
  color: #ffffff;
  @media (max-width: 992px) {
    font-size: 24px;
  }
`;

const TitleText = styled.div`
  font-family: "Manrope";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #ffffff;
  margin-top: 1rem;
  opacity: ${(props) => (props.opacity ? props.opacity : "1")};
  @media (max-width: 992px) {
    font-size: 14px;
  }
`;

const GetStartedHeader = styled.div`
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 1.2;
  color: #ffffff;
  margin-top: 30px;
`;

const FormGroup = styled(Form.Group)`
  &&& {
    margin-bottom: 1rem;
    input,
    textarea {
      padding: 0.8rem;
      font-size: 0.8rem;
    }
  }
`;

const FormGroupTeam = styled(Form.Group)`
  &&& {
    opacity: ${(props) => (props.opacity ? props.opacity : "1")};
    border-radius: 5px;
    position: relative;
    padding: 0.2rem;

    input {
      //padding: 6px 18px;
      //font-size: 0.8rem;
    }
    .spinner-border {
      position: absolute;
      right: 10px;
      bottom: 16px;
    }
  }
`;

const FormCheck = styled(Form.Check)`
  &&& {
    input {
      float: none;
      padding: 8px;
      margin-right: 0.5rem;

      &:checked[type="radio"] {
        background: #81c2c0;
      }
      &:focus {
        border-color: none;
        box-shadow: none;
      }
    }
  }
`;

const Formlabel = styled(Form.Label)`
  font-family: "Barlow Condensed";
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 38px;
  color: rgba(255, 255, 255, 1);
  text-transform: capitalize;
  background: transparent;
  opacity: ${(props) => (props.opacity ? props.opacity : "1")};
`;

const StyledCheckbox = styled(Checkbox)`
  &&& {
    margin-left: 10px;
    margin-right: 10px;
    .form-check-input {
      cursor: pointer;
    }
    .form-check-label {
      cursor: pointer;
    }
  }
`;

const Error = styled.div`
  color: red;
  margin-top: 0.25rem;
`;
const LoginCardWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 60px;
  @media (max-width: 625px) {
    margin-top: 30px;
  }
  .card {
    border: none !important;
    width: 100% !important;
  }
`;

const schema = yup.object().shape({
  displayName: yup.string().trim().required(),
  // question: yup.string().trim(),
});
