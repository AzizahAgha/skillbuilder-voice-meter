import AnswersTable from "../components/dataTables/AnswersTable";
import React, { useCallback, useEffect } from "react";
import Header from "@ui-library/AskAnswerInviteHeader";
import styled from "styled-components";
import { useRouter } from "next/router";
import Button from "@ui-library/Button";
import StepHeader from "@ui-library/StepHeader";
import { useMediaQuery } from "react-responsive";
import { Col, Container, Row } from "react-bootstrap";
import { useAuthUser } from "@contexts/AuthContext";
import LoginCard from "@ui-library/LoginCard";
import { Form, Formik } from "formik";
import { useMutation } from "react-query";
import teamService from "@services/team.service";
import { useTeam } from "@contexts/TeamContext";
import transformQuestionsForSaving from "@transformers/questionsForSaving.transformer";
import questionService from "@services/question.service";
import striptags from "striptags";
import answerService from "@services/answer.service";
import transformAnswerForSaving from "@transformers/answerForSaving.transformer";
import * as Yup from "yup";
import {
  createReactPageFromHTML,
  getPageFromWebflow,
  Width,
} from "../utils/helpers";
import HeaderSessionWidget from "@components/session-widgets/HeaderSessionWidget";
import Head from "next/head";
import AnswersWrapper from "@components/mobile/AnswersWrapper";
import Bus from "@utils/Bus";

const TextButton = styled.span`
  font-family: Manrope, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: #969c9d;
  cursor: pointer;
  margin-bottom: 43px;
  display: inline-block;
`;

const ContinueButton = styled(Button)`
  float: right;
`;

const EditQuestionButton = styled(Button)`
  justify-self: start;
`;

const LoginCardWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const initialFormData = { questions: [] };

const validationSchema = Yup.object().shape({
  questions: Yup.array().of(
    Yup.object().shape({
      answer: Yup.string(),
    })
  ),
});

export function Answer() {
  const router = useRouter();
  const { auth } = useAuthUser();
  const { team, setTeam } = useTeam();
  const [initialFormData, setInitialFormData] = React.useState({
    questions: [],
  });
  const isTabletOrMobile = useMediaQuery({ maxWidth: Width.mobile });

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

        setInitialFormData({ questions: data });
      },
      onError:(error) => {
				Bus.emit("error", { operation: "open",error:error.response});
			}
    }
  );

  const teamMutation = useMutation((teamData) => teamService.create(teamData), {
    onSuccess: (data) => {
      setTeam(data);

      const localData = localStorage.getItem("questions");
      if (localData && auth.isAuthenticated) {
        const { questions } = JSON.parse(localData).values;
        questionMutation.mutate({
          teamId: data.id,
          questions: transformQuestionsForSaving(questions),
        });
      }
    },
    onError:(error) => {
      Bus.emit("error", { operation: "open",error:error.response});
    }
  });

  const onLoginSuccess = () => {
    const displayName = localStorage.getItem("ORG");
    const teamName = localStorage.getItem("teamName");
    teamMutation.mutate({ teamName, displayName });
  };

  const saveAndContinue = async () => {
    if (auth.isAuthenticated) {
      const localData = localStorage.getItem("questions");
      if (localData) {
        const localQuestions = JSON.parse(localData).values.questions;
        const answers = [];

        localQuestions.map((row, i) => {
          if (striptags(row.answer).trim() !== "") {
            answers.push({
              questionId: row.questionId,
              ...transformAnswerForSaving(row),
            });
            // console.log("inside localQuestions-map-1", row);
          } else if (
            striptags(JSON.parse(localStorage.getItem("answers"))[i]).trim() !==
            ""
          ) {
            answers.push({
              questionId: row.questionId,
              ...transformAnswerForSaving(
                Object.assign(row, {
                  answer: JSON.parse(localStorage.getItem("answers"))[i],
                })
              ),
            });
          }
          // console.log(
          //   "inside localQuestions-map-2",
          //   Object.assign(row, { answer: localStorage.getItem("answers" + i) })
          // );
          // console.log("answers" + i);
        });

        if (answers && answers?.length > 0) {
          answerService
            .batchAdd(team.id, { answers })
            .then(() => {
              localStorage.removeItem("questions");
              localStorage.removeItem("answers");
              localStorage.removeItem("questionnaire");
              router.push("/invite");
            })
            .catch(console.log);
        } else {
          localStorage.removeItem("questions");
          localStorage.removeItem("answers");
          localStorage.removeItem("questionnaire");
          router.push("/invite");
          
        }
      }
    } else {
      router.push("/invite");
    }
  };

  useEffect(() => {
    const displayName = localStorage.getItem("ORG");
    const teamName = localStorage.getItem("teamName");

    if (!displayName && !teamName) router.push("/");
  }, []);

  const goToQuestions = useCallback(() => {
    const questionnaire = JSON.parse(localStorage.getItem("questions"));

    let questions = questionnaire.values.questions;

    if (questions.length < 10) {
      questions = [
        ...questions,
        ...Array.from({ length: 10 - questions.length }).map(() => ({
          question: "",
          frequency: "Sometimes",
          importance: 1,
          confidence: 1,
          differentiation: 1,
        })),
      ];
    }

    localStorage.setItem(
      "questionnaire",
      JSON.stringify({ ...questionnaire, values: { questions } })
    );

    router.push("/ask");
  }, []);

  return (
    <div className="bs">
      <Header
        component={
          !isTabletOrMobile ? (
            <LoginCardWrapper>
              {!auth.isAuthenticated && (
                <LoginCard onSuccess={onLoginSuccess} />
              )}
            </LoginCardWrapper>
          ) : null
        }
      />
      <Formik
        initialValues={initialFormData}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {(formikProps) => (
          <Form>
            <Container className="my-4">
              <TextButton onClick={() => goToQuestions()}>
                &lt; Back to Questions
              </TextButton>
              <StepHeader
                title={"Time to answer some of these critical questions!"}
                currentQuestions={2}
                numOfQuestions={10}
                onSavePress={saveAndContinue}
                showProgress={false}
                step={2}
              >
                Answer what questions you can but don&apos;t worry if your
                answers are incomplete. You&apos;ll be able to invite colleagues
                to help at the next step.
              </StepHeader>

              {!isTabletOrMobile ? <AnswersTable /> : <AnswersWrapper />}

              <Row className="mt-5">
                <Col>
                  {!isTabletOrMobile && (
                    <EditQuestionButton
                      background={"#969C9D"}
                      onClick={() => goToQuestions()}
                    >
                      &lt; Edit Questions
                    </EditQuestionButton>
                  )}
                </Col>
                <Col>
                  {!auth.isAuthenticated && (
                    <LoginCard onSuccess={onLoginSuccess} />
                  )}
                </Col>
                <Col>
                  {!isTabletOrMobile && (
                    <ContinueButton type="button" onClick={saveAndContinue}>
                      Save & Continue
                    </ContinueButton>
                  )}
                </Col>
              </Row>
            </Container>

            {isTabletOrMobile && (
              <Wrapper>
                <Footer>
                  <FooterButton
                    className="me-4"
                    background={"#969C9D"}
                    onClick={() => goToQuestions()}
                  >
                    &lt; Edit Questions
                  </FooterButton>
                  <FooterButton type="button" onClick={saveAndContinue}>
                    Save & Continue
                  </FooterButton>
                </Footer>
              </Wrapper>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

const FooterButton = styled(Button)`
  margin-bottom: 0;
  align-self: center;
  width: 90%;
`;

const Footer = styled.div`
  position: fixed;
  background: white;
  bottom: 0;
  display: flex;
  flex-direction: row;
  padding: 8px 20px;
  width: 100%;
  box-shadow: 0px -26px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 1224px) {
    z-index: 1;
  }
`;

const instructions = {
  replace: (domNode) => {
    if (domNode.attribs && domNode.attribs.id === "answer-placeholder") {
      return <Answer />;
    }

    if (domNode.attribs && domNode.attribs.id === "btn-my-account") {
      return <HeaderSessionWidget />;
    }
  },
};

export default function AnswerPage({ HEAD, BODY }) {
  return (
    <>
      <Head>{createReactPageFromHTML(HEAD)}</Head>
      <>{createReactPageFromHTML(BODY, instructions)}</>
    </>
  );
}

export async function getStaticProps() {
  const { BODY, HEAD } = await getPageFromWebflow("/answer");

  return {
    props: { HEAD, BODY },
  };
}
