import React, { useEffect } from "react";
import QuestionnaireTable from "../components/dataTables/QuestionnaireTable";
import Button from "@ui-library/Button";
import styled from "styled-components";
import Header from "@ui-library/AskAnswerInviteHeader";
import { useRouter } from "next/router";
import StepHeader from "@ui-library/StepHeader";
import { Col, Container, Row } from "react-bootstrap";
import { Form, Formik } from "formik";
import LoginCard from "@ui-library/LoginCard";
import { useAuthUser } from "@contexts/AuthContext";
import { useMutation } from "react-query";
import teamService from "@services/team.service";
import { useTeam } from "@contexts/TeamContext";
import transformQuestionsForSaving from "@transformers/questionsForSaving.transformer";
import questionService from "@services/question.service";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import Head from "next/head";
import {
  createReactPageFromHTML,
  getPageFromWebflow,
  Width,
} from "@utils/helpers";
import QuestionsWrapper from "@components/mobile/QuestionsWrapper";
import Bus from "@utils/Bus";

const initialFormData = {
  questions: [],
};

export function Ask() {
  const router = useRouter();
  const { auth } = useAuthUser();
  const { team, setTeam } = useTeam();

  const trimQuestions = (questions) =>
    questions.filter(({ question }) => question.trim());

  const continueToAnswers = () => {
    const questionnaire = JSON.parse(localStorage.getItem("questionnaire"));
    const questions = trimQuestions(questionnaire.values.questions);

    localStorage.setItem(
      "questions",
      JSON.stringify({ ...questionnaire, values: { questions } })
    );
    router.push("/answer");
  };

  const teamMutation = useMutation((teamData) => teamService.create(teamData), {
    onSuccess: (data) => {
      setTeam(data);
    },
    onError: (error) => {
      Bus.emit("error", { operation: "open", error: error.response });
    },
  });

  const questionMutation = useMutation(
    ({ teamId, questions }) => questionService.batchUpdate(teamId, questions),
    {
      onSuccess: (res) => {
        localStorage.setItem("ORG", "");
        const data = res.data.map((_q) => ({
          ..._q,
          question: _q.questionText,
          confidence: 1,
          differentiation: 1,
        }));

        localStorage.setItem(
          "questions",
          JSON.stringify({ values: { questions: data } })
        );

        router.push("/answer");

        // continueToAnswers();
      },
      onError: (error) => {
        Bus.emit("error", { operation: "open", error: error.response });
      },
    }
  );

  const onLoginSuccess = () => {
    const displayName = localStorage.getItem("ORG");
    const teamName = localStorage.getItem("teamName");

    teamMutation.mutateAsync({ teamName, displayName }).then(() => {});
  };

  const saveAndContinue = () => {
    const localData = localStorage.getItem("questionnaire");

    if (localData && auth.isAuthenticated) {
      const { questions } = JSON.parse(localData).values;

      const data = transformQuestionsForSaving(trimQuestions(questions));

      questionMutation.mutateAsync({
        teamId: team?.id,
        questions: data,
      });
    } else {
      continueToAnswers();
    }
  };

  useEffect(() => {
    const displayName = localStorage.getItem("ORG");
    const teamName = localStorage.getItem("teamName");

    if (!displayName && !teamName) router.push("/");
  }, [router]);

  return (
    <div className="bs">
      <Header
        component={
          <LoginCardWrapper className="d-none d-lg-flex">
            {!auth.isAuthenticated && <LoginCard onSuccess={onLoginSuccess} />}
          </LoginCardWrapper>
        }
      />

      <Formik initialValues={initialFormData} enableReinitialize>
        {(formikProps) => (
          <Form>
            <Container className="mb-5">
              <Row>
                <StepHeader
                  step={1}
                  title={"Enter Critical Questions"}
                  currentQuestions={
                    trimQuestions(formikProps.values.questions).length
                  }
                  numOfQuestions={formikProps.values.questions.length}
                  onSavePress={saveAndContinue}
                >
                  Click in the fields below to enter the top key questions that
                  a prospect or client might ask you about your product,
                  service, or company. You&apos;ll have the opportunity to
                  categorize these, but don&apos;t forget to rate how often
                  (frequency) and how important each question is to winning a
                  deal or getting a next step (meeting, proposal, demo, etc).
                  We&apos;ll automatically calculate the question&apos;s
                  priority based on the combination of frequency and importance.
                </StepHeader>
              </Row>

              <Row>
                <React.Fragment>
                  {/* <ExampleQuestionnaire /> */}
                  <div className="d-none d-lg-block">
                    <QuestionnaireTable />
                  </div>
                  <div className="d-block d-lg-none">
                    <QuestionsWrapper />
                  </div>
                </React.Fragment>
              </Row>

              <Row>
                <Col className=" col-md-3"></Col>
                <StyledCol className="col-md-6  col-sm-10 ">
                  {!auth.isAuthenticated && (
                    <StyledLoginCard onSuccess={onLoginSuccess} />
                  )}
                </StyledCol>

                <Col className="d-none d-lg-block ">
                  <SaveButton
                    type="button"
                    onClick={() => {
                      if (
                        trimQuestions(formikProps.values.questions).length > 0
                      )
                        saveAndContinue();
                    }}
                  >
                    Continue to Answers
                  </SaveButton>
                </Col>
              </Row>
            </Container>

            <Wrapper className="d-block d-lg-none ">
              <Footer>
                <SaveButton
                  type="button"
                  onClick={() => {
                    if (trimQuestions(formikProps.values.questions).length > 0)
                      saveAndContinue();
                  }}
                >
                  Save & Continue
                </SaveButton>
              </Footer>
            </Wrapper>
          </Form>
        )}
      </Formik>
    </div>
  );
}

const StyledCol = styled(Col)`
  &&& {
    @media (max-width: 576px) {
      flex-basis: 80%;
    }
  }
`;

const StyledLoginCard = styled(LoginCard)`
  &&& {
    margin: 0 auto;
  }
`;
const Wrapper = styled.div`
  position: relative;
`;

const SaveButton = styled(Button)`
  align-self: end;
  margin-bottom: 25px;
  float: right;

  @media (max-width: 1224px) {
    margin-bottom: 0;
    align-self: center;
    width: 90%;
  }
`;

const Footer = styled.div`
  position: fixed;
  background: white;
  bottom: 0;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  width: 100%;
  box-shadow: 0px -26px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 1224px) {
    z-index: 1;
  }
`;

const LoginCardWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "question") {
      return <Ask />;
    }

    // if (domNode.attribs && domNode.attribs.id === 'schedule-demo') {
    //   return <></>;
    // }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export default function AskPage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/question");

  return {
    props: { HEAD, BODY },
  };
}
